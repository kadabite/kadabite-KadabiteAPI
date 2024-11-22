
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class OrderItem2 {
    comments?: Nullable<string>;
    id: string;
    quantity?: Nullable<number>;
    ratings?: Nullable<number>;
}

export class OrderItems {
    comments?: Nullable<string>;
    productId: string;
    quantity?: Nullable<number>;
    ratings?: Nullable<number>;
}

export class UpdateProduct {
    currency?: Nullable<string>;
    description?: Nullable<string>;
    name?: Nullable<string>;
    photo?: Nullable<string>;
    price?: Nullable<number>;
}

export abstract class IMutation {
    abstract login(email: string, password: string): Message | Promise<Message>;

    abstract createCategories(name: string[]): Message | Promise<Message>;

    abstract createCategory(name: string): Message | Promise<Message>;

    abstract deleteCategory(id: string): Message | Promise<Message>;

    abstract addUserLocation(address: string, lga?: Nullable<string>, state?: Nullable<string>, country?: Nullable<string>, longitude?: Nullable<string>, latitude?: Nullable<string>): Message | Promise<Message>;

    abstract createLocation(location: string): Message | Promise<Message>;

    abstract deleteUserLocation(locationId: string): Message | Promise<Message>;

    abstract updateUserLocation(locationId: string, address: string, lga: string, state: string, country: string, longitude: string, latitude: string): Message | Promise<Message>;

    abstract createOrder(sellerId: string, dispatcherId: string, deliveryAddress: string, orderItems: Nullable<OrderItems>[]): Message | Promise<Message>;

    abstract deleteAnOrderItem(orderId: string, orderItemId: string): Message | Promise<Message>;

    abstract deleteOrder(orderId: string): Message | Promise<Message>;

    abstract deleteOrderItemsNow(ids: Nullable<string>[]): Message | Promise<Message>;

    abstract updateOrder(orderId: string, deliveryAddress?: Nullable<string>, receivedByBuyer?: Nullable<boolean>, deliveredByDispatcher?: Nullable<boolean>): Message | Promise<Message>;

    abstract updateOrderItems(orderId: string, orderItems: Nullable<OrderItem2>[]): Message | Promise<Message>;

    abstract createPayment(orderId: string, paymentMethod: string, currency: string, sellerAmount: number, dispatcherAmount: number): Message | Promise<Message>;

    abstract updatePayment(paymentId: string, status: string): Message | Promise<Message>;

    abstract createProduct(name: string, description: string, price: number, currency: string, categoryId: string): Message | Promise<Message>;

    abstract deleteProduct(id: string): Message | Promise<Message>;

    abstract updateProduct(id: string, currency?: Nullable<string>, description?: Nullable<string>, name?: Nullable<string>, photo?: Nullable<string>, price?: Nullable<number>): Message | Promise<Message>;

    abstract createUser(password: string, phoneNumber: string, email?: Nullable<string>): Message | Promise<Message>;

    abstract deleteUser(): Message | Promise<Message>;

    abstract forgotPassword(email: string): Message | Promise<Message>;

    abstract logout(): Message | Promise<Message>;

    abstract registerUser(firstName: string, lastName: string, username: string, userType: string, email: string, phoneNumber: string, lga: string, state: string, country: string, address: string, longitude?: Nullable<string>, latitude?: Nullable<string>, vehicleNumber?: Nullable<string>): Message | Promise<Message>;

    abstract updatePassword(email: string, token: string, password: string): Message | Promise<Message>;

    abstract updateUser(firstName?: Nullable<string>, lastName?: Nullable<string>, longitude?: Nullable<string>, latitude?: Nullable<string>, userName?: Nullable<string>, lga?: Nullable<string>, state?: Nullable<string>, country?: Nullable<string>, address?: Nullable<string>, buyerStatus?: Nullable<string>, sellerStatus?: Nullable<string>, dispatcherStatus?: Nullable<string>, vehicleNumber?: Nullable<string>): Message | Promise<Message>;
}

export abstract class IQuery {
    abstract getNewAccessToken(refreshToken: string): Message | Promise<Message>;

    abstract categories(): Message | Promise<Message>;

    abstract category(id: string): Message | Promise<Message>;

    abstract getCountries(): Message | Promise<Message>;

    abstract getLgas(state: string): Message | Promise<Message>;

    abstract getStates(country: string): Message | Promise<Message>;

    abstract getUserLocations(): Message | Promise<Message>;

    abstract getAllOrders(page?: Nullable<number>, limit?: Nullable<number>): Message | Promise<Message>;

    abstract getAnOrderItem(orderItemId: string): Message | Promise<Message>;

    abstract getMyOrderItems(orderId: string): Message | Promise<Message>;

    abstract getMyOrders(page?: Nullable<number>, limit?: Nullable<number>): Message | Promise<Message>;

    abstract getTheOrderAsDispatcher(page?: Nullable<number>, limit?: Nullable<number>): Message | Promise<Message>;

    abstract getTheOrderAsSeller(page?: Nullable<number>, limit?: Nullable<number>): Message | Promise<Message>;

    abstract getMyPayment(orderId: string): Message | Promise<Message>;

    abstract getAllProducts(page?: Nullable<number>, limit?: Nullable<number>): Message | Promise<Message>;

    abstract getAllProductsOfUsersByCategory(categoryId: string, page?: Nullable<number>, limit?: Nullable<number>): Message | Promise<Message>;

    abstract getProduct(id: string): Message | Promise<Message>;

    abstract getUserProducts(): Message | Promise<Message>;

    abstract findFoods(productName: string, page?: Nullable<number>, limit?: Nullable<number>): Message | Promise<Message>;

    abstract user(): Message | Promise<Message>;

    abstract users(page?: Nullable<number>, limit?: Nullable<number>): Message | Promise<Message>;
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

export class State {
    id: string;
    name: string;
    country?: Nullable<Country>;
}

export class Order {
    currency: string;
    deliveryAddress: string;
    dispatcherId?: Nullable<string>;
    id: string;
    orderDateTime: string;
    orderItems: Nullable<string>[];
    payment?: Nullable<Nullable<Payment>[]>;
    paymentToken?: Nullable<string>;
    sellerId: string;
    status: string;
    timeOfDelivery?: Nullable<string>;
    totalAmount: number;
}

export class OrderItem {
    comments?: Nullable<string>;
    id: string;
    productId: string;
    quantity?: Nullable<number>;
    ratings?: Nullable<number>;
}

export class Payment {
    currency: string;
    dispatcherAmount: number;
    dispatcherPaymentStatus: string;
    id: string;
    orderId: string;
    paymentDateTime: string;
    paymentMethod?: Nullable<string>;
    paymentStatus: string;
    sellerAmount: number;
    sellerPaymentStatus: string;
    totalAmount: number;
}

export class Payments {
    currency: string;
    dispatcherAmount: number;
    dispatcherPaymentStatus: string;
    id: string;
    lastUpdateTime: string;
    paymentDateTime?: Nullable<string>;
    paymentMethod: string;
    sellerAmount: number;
    sellerPaymentStatus: string;
}

export class Product {
    categoryId?: Nullable<string>;
    createdAt: string;
    currency: string;
    description: string;
    id: string;
    name: string;
    photo?: Nullable<string>;
    price: number;
    updatedAt: string;
}

export class Message {
    categoriesData?: Nullable<Nullable<Category>[]>;
    categoryData?: Nullable<Category>;
    countriesData?: Nullable<Nullable<Country>[]>;
    countryData?: Nullable<Country>;
    foodsData?: Nullable<Nullable<Restaurant>[]>;
    id?: Nullable<string>;
    lgasData?: Nullable<Nullable<Lga>[]>;
    locationsData?: Nullable<Nullable<Location>[]>;
    message?: Nullable<string>;
    ok: boolean;
    orderData?: Nullable<Order>;
    orderItemData?: Nullable<OrderItem>;
    orderItemsData?: Nullable<Nullable<OrderItem>[]>;
    ordersData?: Nullable<Nullable<Order>[]>;
    paymentData?: Nullable<Payment>;
    paymentsData?: Nullable<Nullable<Payment>[]>;
    productData?: Nullable<Product>;
    productsData?: Nullable<Nullable<Product>[]>;
    pagination?: Nullable<Pagination>;
    refreshToken?: Nullable<string>;
    statesData?: Nullable<Nullable<State>[]>;
    statusCode: number;
    token?: Nullable<string>;
    userData?: Nullable<User>;
    usersData?: Nullable<Nullable<Users>[]>;
}

export class Pagination {
    totalItems?: Nullable<number>;
    totalPages?: Nullable<number>;
    currentPage?: Nullable<number>;
    itemsPerPage?: Nullable<number>;
}

export class Restaurant {
    addressSeller?: Nullable<Location>;
    businessDescription?: Nullable<string>;
    createdAt: string;
    currency?: Nullable<string>;
    description?: Nullable<string>;
    email: string;
    id: string;
    name: string;
    phoneNumber?: Nullable<string>;
    photo?: Nullable<string>;
    price?: Nullable<number>;
    products: Nullable<string>[];
    userId: string;
    username: string;
}

export class User {
    addressBuyer?: Nullable<Nullable<Location>[]>;
    addressDispatcher?: Nullable<Nullable<Location>[]>;
    addressSeller?: Nullable<Nullable<Location>[]>;
    buyerStatus?: Nullable<string>;
    businessDescription?: Nullable<string>;
    createdAt: string;
    dispatcherStatus?: Nullable<string>;
    email?: Nullable<string>;
    firstName?: Nullable<string>;
    id: string;
    isDeleted?: Nullable<boolean>;
    isLoggedIn?: Nullable<boolean>;
    lastName?: Nullable<string>;
    locations: Nullable<string>[];
    phoneNumber?: Nullable<string>;
    photo?: Nullable<string>;
    products: Nullable<string>[];
    sellerStatus?: Nullable<string>;
    updatedAt: string;
    userType?: Nullable<string>;
    username?: Nullable<string>;
}

export class Users {
    email?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    phoneNumber?: Nullable<string>;
    role: string;
    username?: Nullable<string>;
}

type Nullable<T> = T | null;
