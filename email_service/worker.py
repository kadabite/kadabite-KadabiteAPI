import os
import json
import redis
import asyncio
from email_client import mailSender, logger

# Connect to Redis
redis_conn = redis.Redis(host='redis', port=6379)

async def process_job(job_data):
    try:
        await mailSender(**job_data)
        logger.info(f"Processed job: id={job_data['id']}")
    except Exception as e:
        logger.warning(f"Failed to process job: id={job_data['id']}, error: {e}")

async def listen_to_queue():
    while True:
        _, message = redis_conn.brpop('user_data_queue')
        job_data = json.loads(message)
        logger.info(f"Received job: id={job_data['id']}")
        await process_job(job_data)

async def main():
    logger.info("Worker is running and waiting for jobs...")
    await listen_to_queue()

if __name__ == '__main__':
    asyncio.run(main())