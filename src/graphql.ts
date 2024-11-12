
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class OrderItem2 {
    id: string;
    quantity?: Nullable<number>;
    comments?: Nullable<string>;
    ratings?: Nullable<number>;
}

export class OrderItems {
    productId: string;
    quantity?: Nullable<number>;
    comments?: Nullable<string>;
    ratings?: Nullable<number>;
}

export class UpdateProduct {
    name?: Nullable<string>;
    description?: Nullable<string>;
    price?: Nullable<number>;
    currency?: Nullable<string>;
    photo?: Nullable<string>;
}

export class Category {
    id: string;
    name: string;
    products?: Nullable<Nullable<Product>[]>;
}

export class Country {
    id: string;
    name: string;
    states?: Nullable<Nullable<State>[]>;
}

export class Lga {
    id: string;
    name: string;
    state?: Nullable<State>;
}

export class Location {
    id?: Nullable<string>;
    name?: Nullable<string>;
    longitude?: Nullable<string>;
    latitude?: Nullable<string>;
}

export class Message {
    message?: Nullable<string>;
    token?: Nullable<string>;
    id?: Nullable<string>;
    userData?: Nullable<User>;
    usersData?: Nullable<Nullable<Users>[]>;
    foodsData?: Nullable<Nullable<Restaurant>[]>;
    orderData?: Nullable<Order>;
    ordersData?: Nullable<Nullable<Order>[]>;
    productData?: Nullable<Product>;
    productsData?: Nullable<Nullable<Product>[]>;
    orderItemsData?: Nullable<Nullable<OrderItem>[]>;
    orderItemData?: Nullable<OrderItem>;
    paymentsData?: Nullable<Nullable<Payment>[]>;
    paymentData?: Nullable<Payment>;
    categoryData?: Nullable<Category>;
    categoriesData?: Nullable<Nullable<Category>[]>;
    locationsData?: Nullable<Nullable<Location>[]>;
    statesData?: Nullable<Nullable<State>[]>;
    lgasData?: Nullable<Nullable<Lga>[]>;
    countriesData?: Nullable<Nullable<Country>[]>;
    statusCode: number;
    ok: boolean;
    refreshToken?: Nullable<string>;
}

export abstract class IMutation {
    abstract addUserLocation(address: string, lga?: Nullable<string>, state?: Nullable<string>, country?: Nullable<string>, longitude?: Nullable<string>, latitude?: Nullable<string>): Message | Promise<Message>;

    abstract createCategory(name: string): Message | Promise<Message>;

    abstract createCategories(name: string[]): Message | Promise<Message>;

    abstract createLocation(location: string): Message | Promise<Message>;

    abstract createOrder(sellerId: string, deliveryAddress: string, orderItems: Nullable<OrderItems>[], dispatcherId?: Nullable<string>,): Message | Promise<Message>;

    abstract createPayment(orderId: string, paymentMethod: string, currency: string, sellerAmount: number, dispatcherAmount: number): Message | Promise<Message>;

    abstract createProduct(name: string, description: string, price: number, currency: string, categoryId: string): Message | Promise<Message>;

    abstract createUser(password: string, email?: Nullable<string>, phoneNumber?: Nullable<string>): Message | Promise<Message>;

    abstract deleteAnOrderItem(orderId: string, orderItemId: string): Message | Promise<Message>;

    abstract deleteCategory(id: string): Message | Promise<Message>;

    abstract deleteOrder(orderId: string): Message | Promise<Message>;

    abstract deleteOrderItemsNow(ids: Nullable<string>[]): Message | Promise<Message>;

    abstract deleteProduct(id: string): Message | Promise<Message>;

    abstract deleteUser(): Message | Promise<Message>;

    abstract deleteUserLocation(locationId: string): Message | Promise<Message>;

    abstract forgotPassword(email: string): Message | Promise<Message>;

    abstract login(email: string, password: string): Message | Promise<Message>;

    abstract logout(): Message | Promise<Message>;

    abstract registerUser(firstName: string, lastName: string, username: string, userType: string, email: string, phoneNumber: string, lga: string, state: string, country: string, address: string, longitude?: Nullable<string>, latitude?: Nullable<string>, vehicleNumber?: Nullable<string>): Message | Promise<Message>;

    abstract updateOrder(orderId: string, status: string): Message | Promise<Message>;

    abstract updateOrderItems(orderId: string, orderItems: Nullable<OrderItem2>[]): Message | Promise<Message>;

    abstract updatePassword(email: string, token: string, password: string): Message | Promise<Message>;

    abstract updatePayment(paymentId: string, status: string): Message | Promise<Message>;

    abstract updateProduct(orderId: string, deliveryAddress: string, recievedByBuyer?: Nullable<boolean>, deliveredByDispatcher?: Nullable<boolean>): Message | Promise<Message>;

    abstract updateUser(firstName?: Nullable<string>, lastName?: Nullable<string>, longitude?: Nullable<string>, latitude?: Nullable<string>, userName?: Nullable<string>, lga?: Nullable<string>, state?: Nullable<string>, country?: Nullable<string>, address?: Nullable<string>, buyerStatus?: Nullable<string>, sellerStatus?: Nullable<string>, dispatcherStatus?: Nullable<string>, vehicleNumber?: Nullable<string>): Message | Promise<Message>;

    abstract updateUserLocation(locationId: string, address: string, lga: string, state: string, country: string, longitude: string, latitude: string): Message | Promise<Message>;
}

export class Order {
    id: string;
    sellerId: string;
    buyerId: string;
    dispatcherId?: Nullable<string>;
    orderDateTime: string;
    timeOfDelivery?: Nullable<string>;
    deliveryAddress: string;
    currency: string;
    totalAmount: number;
    status: string;
    orderItems: Nullable<string>[];
    payment?: Nullable<Nullable<Payment>[]>;
    paymentToken?: Nullable<string>;
}

export class OrderItem {
    id: string;
    productId: string;
    quantity?: Nullable<number>;
    comments?: Nullable<string>;
    ratings?: Nullable<number>;
}

export class Payment {
    id: string;
    orderId: string;
    paymentDateTime: string;
    paymentMethod?: Nullable<string>;
    currency: string;
    totalAmount: number;
    paymentStatus: string;
}

export class Payments {
    id: string;
    paymentDateTime?: Nullable<string>;
    lastUpdateTime: string;
    paymentMethod: string;
    currency: string;
    sellerAmount: number;
    dispatcherAmount: number;
    sellerPaymentStatus: string;
    dispatcherPaymentStatus: string;
}

export class Product {
    id: string;
    name: string;
    description: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    currency: string;
    photo?: Nullable<string>;
    categoryId?: Nullable<string>;
}

export abstract class IQuery {
    abstract category(id: string): Message | Promise<Message>;

    abstract categories(): Message | Promise<Message>;

    abstract findFoods(productName: string): Message | Promise<Message>;

    abstract findRestaurants(username?: Nullable<string>): Message | Promise<Message>;

    abstract getAllOrders(): Message | Promise<Message>;

    abstract getAllProducts(): Message | Promise<Message>;

    abstract getAllProductsOfUsersByCategory(categoryId: string): Message | Promise<Message>;

    abstract getAnOrderItem(orderItemId: string): Message | Promise<Message>;

    abstract getMyOrderItems(orderId: string): Message | Promise<Message>;

    abstract getMyOrders(): Message | Promise<Message>;

    abstract getMyPayment(orderId: string): Message | Promise<Message>;

    abstract getNewAccessToken(refreshToken: string): Message | Promise<Message>;

    abstract getProduct(id: string): Message | Promise<Message>;

    abstract getStates(country: string): Message | Promise<Message>;

    abstract getLgas(state: string): Message | Promise<Message>;

    abstract getCountries(): Message | Promise<Message>;

    abstract getTheOrderAsDispatcher(): Message | Promise<Message>;

    abstract getTheOrderAsSeller(): Message | Promise<Message>;

    abstract getUserLocations(): Message | Promise<Message>;

    abstract getUserProducts(): Message | Promise<Message>;

    abstract thirdPartyUser(username: string): ThirdPartyUser | Promise<ThirdPartyUser>;

    abstract user(): Message | Promise<Message>;

    abstract users(): Message | Promise<Message>;
}

export class Restaurant {
    id: string;
    name: string;
    description?: Nullable<string>;
    price?: Nullable<number>;
    currency?: Nullable<string>;
    userId: string;
    username: string;
    businessDescription?: Nullable<string>;
    products: Nullable<string>[];
    phoneNumber?: Nullable<string>;
    email: string;
    createdAt: string;
    photo?: Nullable<string>;
    addressSeller?: Nullable<Nullable<Location>[]>;
}

export class State {
    id: string;
    name: string;
    country?: Nullable<Country>;
}

export class User {
    id: string;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    username?: Nullable<string>;
    email?: Nullable<string>;
    createdAt: string;
    updatedAt: string;
    phoneNumber?: Nullable<string>;
    vehicleNumber?: Nullable<string>;
    isLoggedIn?: Nullable<boolean>;
    isDeleted?: Nullable<boolean>;
    userType?: Nullable<string>;
    buyerStatus?: Nullable<string>;
    sellerStatus?: Nullable<string>;
    dispatcherStatus?: Nullable<string>;
    photo?: Nullable<string>;
    addressSeller?: Nullable<Nullable<Location>[]>;
    addressBuyer?: Nullable<Nullable<Location>[]>;
    addressDispatcher?: Nullable<Nullable<Location>[]>;
    businessDescription?: Nullable<string>;
    products: Nullable<string>[];
    locations: Nullable<string>[];
}

export class Users {
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    username?: Nullable<string>;
    phoneNumber?: Nullable<string>;
    email?: Nullable<string>;
    role: string;
}

export class ThirdPartyUser {
    username: string;
    email: string;
    passwordHash: string;
}

type Nullable<T> = T | null;
