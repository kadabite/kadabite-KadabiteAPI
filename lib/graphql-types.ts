export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
// To generate schema: npx graphql-codegen

export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  products?: Maybe<Array<Maybe<Product>>>;
};

export type Location = {
  __typename?: 'Location';
  id?: Maybe<Scalars['ID']['output']>;
  latitude?: Maybe<Scalars['String']['output']>;
  longitude?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Message = {
  __typename?: 'Message';
  categoriesData?: Maybe<Array<Maybe<Category>>>;
  categoryData?: Maybe<Category>;
  foodsData?: Maybe<Array<Maybe<Restaurant>>>;
  id?: Maybe<Scalars['ID']['output']>;
  locationData?: Maybe<Location>;
  message?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  orderData?: Maybe<Order>;
  orderItemData?: Maybe<OrderItem>;
  orderItemsData?: Maybe<Array<Maybe<OrderItem>>>;
  ordersData?: Maybe<Array<Maybe<Order>>>;
  paymentData?: Maybe<Payment>;
  paymentsData?: Maybe<Array<Maybe<Payment>>>;
  productData?: Maybe<Product>;
  productsData?: Maybe<Array<Maybe<Product>>>;
  statusCode: Scalars['Int']['output'];
  token?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  userData?: Maybe<User>;
  usersData?: Maybe<Array<Maybe<Users>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addUserLocation: Message;
  createCategories: Message;
  createCategory: Message;
  createOrder: Message;
  createPayment: Message;
  createProduct: Message;
  createUser: Message;
  deleteAnOrderItem: Message;
  deleteCategory: Message;
  deleteOrder: Message;
  deleteOrderItemsNow: Message;
  deleteProduct: Message;
  deleteUser: Message;
  deleteLocation: Message;
  forgotPassword: Message;
  login: Message;
  logout: Message;
  updateOrder: Message;
  updateOrderAddress: Message;
  updateOrderItems: Message;
  updatePassword: Message;
  updatePayment: Message;
  updateProduct: Message;
  updateUser: Message;
  updateUserLocation: Message;
};

export type MutationAddUserLocationArgs = {
  address: Scalars['String']['input'];
  country: Scalars['String']['input'];
  latitude: Scalars['String']['input'];
  lga: Scalars['String']['input'];
  longitude: Scalars['String']['input'];
  state: Scalars['String']['input'];
};

export type MutationCreateCategoriesArgs = {
  name: Array<Scalars['String']['input']>;
};


export type MutationCreateCategoryArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateOrderArgs = {
  deliveryAddress: Scalars['String']['input'];
  dispatcherId?: InputMaybe<Scalars['ID']['input']>;
  orderItems: Array<InputMaybe<OrderItems>>;
  sellerId: Scalars['ID']['input'];
};


export type MutationCreatePaymentArgs = {
  currency: Scalars['String']['input'];
  dispatcherAmount: Scalars['Int']['input'];
  orderId: Scalars['ID']['input'];
  paymentMethod: Scalars['String']['input'];
  sellerAmount: Scalars['Int']['input'];
};


export type MutationCreateProductArgs = {
  categoryId: Scalars['ID']['input'];
  currency: Scalars['String']['input'];
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Int']['input'];
};


export type MutationCreateUserArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeleteAnOrderItemArgs = {
  orderId: Scalars['ID']['input'];
  orderItemId: Scalars['ID']['input'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrderArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationDeleteOrderItemsNowArgs = {
  ids: Array<InputMaybe<Scalars['ID']['input']>>;
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationUpdateOrderArgs = {
  orderId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdateOrderAddressArgs = {
  deliveryAddress: Scalars['String']['input'];
  orderId: Scalars['ID']['input'];
};


export type MutationUpdateOrderItemsArgs = {
  orderId: Scalars['ID']['input'];
  orderItems: Array<InputMaybe<OrderItem2>>;
};


export type MutationUpdatePasswordArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationUpdatePaymentArgs = {
  paymentId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdateProductArgs = {
  deliveredByDispatcher?: InputMaybe<Scalars['Boolean']['input']>;
  deliveryAddress: Scalars['String']['input'];
  orderId: Scalars['ID']['input'];
  recievedByBuyer?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationUpdateUserArgs = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
  sellerStatus?: InputMaybe<Scalars['String']['input']>;
  buyerStatus?: InputMaybe<Scalars['String']['input']>;
  dispatcherStatus?: InputMaybe<Scalars['String']['input']>;
  vehicleNumber?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['String']['input']>;
  longitude?: InputMaybe<Scalars['String']['input']>;
  lga?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
};

export type MutationRegisterUserArgs = {
  userType: Scalars['String']['input'];
  username: Scalars['String']['input'];
  vehicleNumber?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['String']['input']>;
  longitude?: InputMaybe<Scalars['String']['input']>;
  lga: Scalars['String']['input'];
  state: Scalars['String']['input'];
  country: Scalars['String']['input'];
  address: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  email: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input']
};

export type MutationUpdateUserLocationArgs = {
  locationId: Scalars['ID']['input'];
  address: Scalars['String']['input'];
  country: Scalars['String']['input'];
  latitude: Scalars['String']['input'];
  lga: Scalars['String']['input'];
  longitude: Scalars['String']['input'];
  state: Scalars['String']['input'];
};

export type Order = {
  __typename?: 'Order';
  buyerId: Scalars['ID']['output'];
  currency: Scalars['String']['output'];
  deliveryAddress: Scalars['String']['output'];
  dispatcherId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  orderDateTime: Scalars['String']['output'];
  orderItems: Array<Maybe<Scalars['String']['output']>>;
  payment?: Maybe<Array<Maybe<Payment>>>;
  paymentToken?: Maybe<Scalars['String']['output']>;
  sellerId: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  timeOfDelivery?: Maybe<Scalars['String']['output']>;
  totalAmount: Scalars['Int']['output'];
};

export type OrderItem = {
  __typename?: 'OrderItem';
  comments?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  productId: Scalars['ID']['output'];
  quantity?: Maybe<Scalars['Int']['output']>;
  ratings?: Maybe<Scalars['Int']['output']>;
};

export type OrderItem2 = {
  comments?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
  ratings?: InputMaybe<Scalars['Int']['input']>;
};

export type OrderItems = {
  comments?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['ID']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
  ratings?: InputMaybe<Scalars['Int']['input']>;
};

export type Payment = {
  __typename?: 'Payment';
  currency: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  orderId: Scalars['ID']['output'];
  paymentDateTime: Scalars['String']['output'];
  paymentMethod?: Maybe<Scalars['String']['output']>;
  paymentStatus: Scalars['String']['output'];
  totalAmount: Scalars['Int']['output'];
};

export type Payments = {
  __typename?: 'Payments';
  currency: Scalars['String']['output'];
  dispatcherAmount: Scalars['Int']['output'];
  dispatcherPaymentStatus: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastUpdateTime: Scalars['String']['output'];
  paymentDateTime?: Maybe<Scalars['String']['output']>;
  paymentMethod: Scalars['String']['output'];
  sellerAmount: Scalars['Int']['output'];
  sellerPaymentStatus: Scalars['String']['output'];
};

export type Product = {
  __typename?: 'Product';
  categoryId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  price: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  categories: Message;
  category: Message;
  findFoods: Message;
  findRestaurants: Message;
  getAllOrders: Message;
  getAllProducts: Message;
  getAllProductsOfUsersByCategory: Message;
  getAnOrderItem: Message;
  getMyOrderItems: Message;
  getMyOrders: Message;
  getMyPayment: Message;
  getNewAccessToken: Message;
  getProduct: Message;
  getTheOrderAsDispatcher: Message;
  getTheOrderAsSeller: Message;
  getUserProducts: Message;
  getUserLocations: Message;
  user: Message;
  users: Message;
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFindFoodsArgs = {
  productName: Scalars['String']['input'];
};


export type QueryFindRestaurantsArgs = {
  username?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetAllProductsOfUsersByCategoryArgs = {
  categoryId: Scalars['ID']['input'];
};


export type QueryGetAnOrderItemArgs = {
  orderItemId: Scalars['ID']['input'];
};


export type QueryGetMyOrderItemsArgs = {
  orderId: Scalars['ID']['input'];
};


export type QueryGetMyPaymentArgs = {
  orderId: Scalars['ID']['input'];
};

export type QueryGetNewAccessTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type QueryGetProductArgs = {
  id: Scalars['ID']['input'];
};

export type Restaurant = {
  __typename?: 'Restaurant';
  addressSeller?: Maybe<Array<Maybe<Location>>>;
  businessDescription?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  currency?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  photo?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  products: Array<Maybe<Scalars['String']['output']>>;
  userId: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  addressBuyer?: Maybe<Array<Maybe<Location>>>;
  addressDispatcher?: Maybe<Array<Maybe<Location>>>;
  addressSeller?: Maybe<Array<Maybe<Location>>>;
  businessDescription?: Maybe<Scalars['String']['output']>;
  buyerStatus?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  dispatcherStatus?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isDeleted?: Maybe<Scalars['Boolean']['output']>;
  isLoggedIn?: Maybe<Scalars['Boolean']['output']>;
  lastName: Scalars['String']['output'];
  lgaId?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  photo?: Maybe<Scalars['String']['output']>;
  products: Array<Maybe<Scalars['String']['output']>>;
  sellerStatus?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  userType?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
  vehicleNumber?: Maybe<Scalars['String']['output']>;
};

export type Users = {
  __typename?: 'Users';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UpdateProduct = {
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
};

export type FindFoodsQueryVariables = Exact<{
  productName: Scalars['String']['input'];
}>;


export type FindFoodsQuery = { __typename?: 'Query', findFoods: { __typename?: 'Message', message?: string | null, ok: boolean, statusCode: number, foodsData?: Array<{ __typename?: 'Restaurant', businessDescription?: string | null, createdAt: string, currency?: string | null, description?: string | null, phoneNumber?: string | null, price?: number | null, products: Array<string | null> } | null> | null } };
