import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Nat "mo:core/Nat";



actor {
  public type Product = {
    id : Nat;
    name : Text;
    category : Text;
    description : Text;
    price : Nat; // INR
    mrp : Nat; // Maximum Retail Price
    wholesalePrice : Nat;
    discountPercent : Nat;
    unit : Text; // e.g., per kg, per piece
    amenities : [Text]; // Features/highlights
    tags : [Text];
    warranty : Text; // Warranty or shelf-life information
    stock : Nat;
    imageUrl : Text;
    isTrending : Bool;
    isShortlisted : Bool;
    shopkeeperId : Nat;
  };

  public type Shopkeeper = {
    id : Nat;
    name : Text;
    shopName : Text;
    location : Text;
    phone : Text;
    category : Text;
    principal : Principal;
  };

  public type DashboardMetrics = {
    totalProducts : Nat;
    totalStockValue : Nat;
    lowStockItems : Nat;
    shortlistedProducts : Nat;
    connectedShopkeepers : Nat;
  };

  module Product {
    public func compareByStock(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.stock, p2.stock);
    };
  };

  var nextProductId = 1;
  var nextShopkeeperId = 1;
  let products = Map.empty<Nat, Product>();
  let shopkeepers = Map.empty<Nat, Shopkeeper>();

  func getShopkeeperIdByPrincipal(principal : Principal) : Nat {
    let iter = shopkeepers.entries();
    switch (iter.find(func(_, s) { s.principal == principal })) {
      case (null) { Runtime.trap("Shopkeeper not found") };
      case (?entry) { entry.0 };
    };
  };

  public shared ({ caller }) func addProduct(
    name : Text,
    category : Text,
    description : Text,
    price : Nat,
    mrp : Nat,
    wholesalePrice : Nat,
    discountPercent : Nat,
    unit : Text,
    amenities : [Text],
    tags : [Text],
    warranty : Text,
    stock : Nat,
    imageUrl : Text,
  ) : async Nat {
    let shopkeeperId = getShopkeeperIdByPrincipal(caller);

    let product : Product = {
      id = nextProductId;
      name;
      category;
      description;
      price;
      mrp;
      wholesalePrice;
      discountPercent;
      unit;
      amenities;
      tags;
      warranty;
      stock;
      imageUrl;
      isTrending = false;
      isShortlisted = false;
      shopkeeperId;
    };

    products.add(nextProductId, product);
    nextProductId += 1;
    product.id;
  };

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProductById(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public shared ({ caller }) func updateProduct(
    id : Nat,
    name : Text,
    category : Text,
    description : Text,
    price : Nat,
    mrp : Nat,
    wholesalePrice : Nat,
    discountPercent : Nat,
    unit : Text,
    amenities : [Text],
    tags : [Text],
    warranty : Text,
    stock : Nat,
    imageUrl : Text,
  ) : async () {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existing) {
        let updatedProduct = {
          existing with
          name;
          category;
          description;
          price;
          mrp;
          wholesalePrice;
          discountPercent;
          unit;
          amenities;
          tags;
          warranty;
          stock;
          imageUrl;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.remove(id);
  };

  public query ({ caller }) func getLowStockProducts(threshold : ?Nat) : async [Product] {
    let thresh = switch (threshold) {
      case (null) { 10 };
      case (?t) { t };
    };
    products.values().toArray().filter(func(p) { p.stock < thresh });
  };

  public shared ({ caller }) func updateStockQuantity(productId : Nat, newStock : Nat) : async () {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let updatedProduct = { product with stock = newStock };
        products.add(productId, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func setTrending(productId : Nat, isTrending : Bool) : async () {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let updatedProduct = { product with isTrending };
        products.add(productId, updatedProduct);
      };
    };
  };

  public query ({ caller }) func getTrendingProducts() : async [Product] {
    products.values().toArray().filter(func(p) { p.isTrending });
  };

  public shared ({ caller }) func toggleShortlist(productId : Nat) : async () {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let updatedProduct = {
          product with
          isShortlisted = not product.isShortlisted
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  public query ({ caller }) func getShortlistedProducts() : async [Product] {
    products.values().toArray().filter(func(p) { p.isShortlisted });
  };

  public shared ({ caller }) func registerShopkeeper(
    name : Text,
    shopName : Text,
    location : Text,
    phone : Text,
    category : Text,
  ) : async Nat {
    let shopkeeper : Shopkeeper = {
      id = nextShopkeeperId;
      name;
      shopName;
      location;
      phone;
      category;
      principal = caller;
    };

    shopkeepers.add(nextShopkeeperId, shopkeeper);
    nextShopkeeperId += 1;
    shopkeeper.id;
  };

  public query ({ caller }) func getAllShopkeepers() : async [Shopkeeper] {
    shopkeepers.values().toArray();
  };

  public query ({ caller }) func getShopkeeperById(id : Nat) : async Shopkeeper {
    switch (shopkeepers.get(id)) {
      case (null) { Runtime.trap("Shopkeeper not found") };
      case (?shopkeeper) { shopkeeper };
    };
  };

  public query ({ caller }) func getDashboardMetrics() : async DashboardMetrics {
    let totalProducts = products.size();
    let totalStockValue = products.values().toArray().foldLeft(
      0,
      func(acc, p) { acc + (p.price * p.stock) },
    );
    let lowStockItems = products.values().toArray().filter(func(p) { p.stock < 10 }).size();
    let shortlistedProducts = products.values().toArray().filter(func(p) { p.isShortlisted }).size();
    let connectedShopkeepers = shopkeepers.size();

    {
      totalProducts;
      totalStockValue;
      lowStockItems;
      shortlistedProducts;
      connectedShopkeepers;
    };
  };
};
