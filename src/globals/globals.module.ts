import { Module } from '@nestjs/common';
import { SharedCacheModule } from '@/globals/cache/cache.module';
import { ModelModule } from '@/globals/model/model.module';

@Module({
    imports: [SharedCacheModule, ModelModule],
    exports: [SharedCacheModule, ModelModule],
})
export class GlobalsModule {}
