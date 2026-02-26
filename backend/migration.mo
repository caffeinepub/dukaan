import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type OldProduct = {
    id : Nat;
    name : Text;
    category : Text;
    description : Text;
    price : Nat;
    stock : Nat;
    imageUrl : Text;
    isTrending : Bool;
    isShortlisted : Bool;
    shopkeeperId : Nat;
  };

  type OldShopkeeper = {
    id : Nat;
    name : Text;
    shopName : Text;
    location : Text;
    phone : Text;
    category : Text;
    principal : Principal;
  };

  type OldActor = {
    nextProductId : Nat;
    nextShopkeeperId : Nat;
    products : Map.Map<Nat, OldProduct>;
    shopkeepers : Map.Map<Nat, OldShopkeeper>;
  };

  type NewProduct = {
    id : Nat;
    name : Text;
    category : Text;
    description : Text;
    price : Nat;
    mrp : Nat;
    wholesalePrice : Nat;
    discountPercent : Nat;
    unit : Text;
    amenities : [Text];
    tags : [Text];
    warranty : Text;
    stock : Nat;
    imageUrl : Text;
    isTrending : Bool;
    isShortlisted : Bool;
    shopkeeperId : Nat;
  };

  type NewShopkeeper = {
    id : Nat;
    name : Text;
    shopName : Text;
    location : Text;
    phone : Text;
    category : Text;
    principal : Principal;
  };

  type NewActor = {
    nextProductId : Nat;
    nextShopkeeperId : Nat;
    products : Map.Map<Nat, NewProduct>;
    shopkeepers : Map.Map<Nat, NewShopkeeper>;
  };

  public func run(old : OldActor) : NewActor {
    let newProducts = old.products.map<Nat, OldProduct, NewProduct>(
      func(_id, oldProduct) {
        {
          oldProduct with
          mrp = oldProduct.price;
          wholesalePrice = oldProduct.price;
          discountPercent = 0;
          unit = "per piece";
          amenities = [];
          tags = [];
          warranty = "No warranty";
        };
      }
    );
    {
      old with
      products = newProducts;
    };
  };
};
