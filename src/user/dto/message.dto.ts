import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CategoryDto } from '@/category/dto/category.dto';
import { CountryDto } from '@/location/dto/country.dto';
import { RestaurantDto } from '@/user/dto/restaurant.dto';
import { LgaDto } from '@/location/dto/lga.dto';
import { LocationDto } from '@/location/dto/location.dto';
import { OrderDto } from '@/order/dto/order.dto';
import { OrderItemDto } from '@/order/dto/order-item.dto';
import { PaymentDto } from '@/payment/dto/payment.dto';
import { PaymentsDto } from '@/payment/dto/payments.dto';
import { ProductDto } from '@/product/dto/product.dto';
import { StateDto } from '@/location/dto/state.dto';
import { UserDto } from '@/user/dto/user.dto';
import { UsersDto } from '@/user/dto/users.dto';
import { IsUUID, IsString } from 'class-validator';
import { WaitListDto } from '@/user/dto/waitlist.dto';

@ObjectType()
export class MessageDto {
  @Field(() => [CategoryDto], { nullable: true })
  categoriesData?: CategoryDto[];

  @Field(() => CategoryDto, { nullable: true })
  categoryData?: CategoryDto;

  @Field(() => [CountryDto], { nullable: true })
  countriesData?: CountryDto[];

  @Field(() => CountryDto, { nullable: true })
  countryData?: CountryDto;

  @Field(() => [RestaurantDto], { nullable: true })
  foodsData?: RestaurantDto[];

  @Field(() => ID, { nullable: true })
  @IsUUID()
  id?: string;

  @Field(() => [LgaDto], { nullable: true })
  lgasData?: LgaDto[];

  @Field(() => [LocationDto], { nullable: true })
  locationsData?: LocationDto[];

  @Field({ nullable: true })
  @IsString()
  message?: string;

  @Field()
  ok: boolean;

  @Field(() => OrderDto, { nullable: true })
  orderData?: OrderDto;

  @Field(() => OrderItemDto, { nullable: true })
  orderItemData?: OrderItemDto;

  @Field(() => [OrderItemDto], { nullable: true })
  orderItemsData?: OrderItemDto[];

  @Field(() => [OrderDto], { nullable: true })
  ordersData?: OrderDto[];

  @Field({ nullable: true })
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };

  @Field(() => PaymentDto, { nullable: true })
  paymentData?: PaymentDto;

  @Field(() => [PaymentDto], { nullable: true })
  paymentsData?: PaymentsDto[];

  @Field(() => ProductDto, { nullable: true })
  productData?: ProductDto;

  @Field(() => [ProductDto], { nullable: true })
  productsData?: ProductDto[];

  @Field(() => [WaitListDto], { nullable: true })
  waitListData?: WaitListDto[];

  @Field({ nullable: true })
  @IsString()
  refreshToken?: string;

  @Field(() => [StateDto], { nullable: true })
  statesData?: StateDto[];

  @Field()
  statusCode: number;

  @Field({ nullable: true })
  @IsString()
  token?: string;

  @Field({ nullable: true })
  @IsUUID()
  emailToken?: string;

  @Field(() => UserDto, { nullable: true })
  userData?: UserDto;

  @Field(() => [UsersDto], { nullable: true })
  usersData?: UsersDto[];
}