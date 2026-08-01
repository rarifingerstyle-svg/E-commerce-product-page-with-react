// App.jsx
import React, { useState, useEffect, useRef } from "react";

// Import images
import product1 from "./images/image-product-1.jpg";
import product2 from "./images/image-product-2.jpg";
import product3 from "./images/image-product-3.jpg";
import product4 from "./images/image-product-4.jpg";
import thumb1 from "./images/image-product-1-thumbnail.jpg";
import thumb2 from "./images/image-product-2-thumbnail.jpg";
import thumb3 from "./images/image-product-3-thumbnail.jpg";
import thumb4 from "./images/image-product-4-thumbnail.jpg";
import iconCart from "./images/icon-cart.svg";
import iconClose from "./images/icon-close.svg";
import iconDelete from "./images/icon-delete.svg";
import iconMenu from "./images/icon-menu.svg";
import iconMinus from "./images/icon-minus.svg";
import iconPlus from "./images/icon-plus.svg";
import iconNext from "./images/icon-next.svg";
import iconPrev from "./images/icon-previous.svg";
import avatar from "./images/image-avatar.png";
import logo from "./images/logo.svg";

const productImages = [product1, product2, product3, product4];
const thumbnails = [thumb1, thumb2, thumb3, thumb4];

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const cartRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setIsCartOpen(false);
      }
    };
    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(0, quantity + delta));
  };

  const addToCart = () => {
    if (quantity === 0) return;
    const existing = cartItems.find(item => item.id === 1);
    if (existing) {
      setCartItems(cartItems.map(item =>
        item.id === 1 ? { ...item, qty: item.qty + quantity } : item
      ));
    } else {
      setCartItems([...cartItems, {
        id: 1,
        name: "Fall Limited Edition Sneakers",
        price: 125.00,
        qty: quantity,
        thumbnail: thumb1
      }]);
    }
    setQuantity(0);
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);

  const prevImage = () => {
    setLightboxIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const currentImage = isLightboxOpen ? productImages[lightboxIndex] : productImages[selectedIndex];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="font-kumbh min-h-screen bg-white relative">
      {/* Overlay for mobile menu and lightbox */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/75 z-40" onClick={toggleMobileMenu} />
      )}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center" onClick={closeLightbox}>
          <div className="relative max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-orange transition-colors"
            >
              <img src={iconClose} alt="Close" className="w-5 h-5" />
            </button>
            <div className="relative">
              <img
                src={productImages[lightboxIndex]}
                alt="Product"
                className="w-full rounded-2xl aspect-square object-cover"
              />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:text-orange transition-colors"
              >
                <img src={iconPrev} alt="Previous" className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:text-orange transition-colors"
              >
                <img src={iconNext} alt="Next" className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              {thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-20 rounded-xl overflow-hidden border-2 transition-all ${lightboxIndex === idx ? "border-orange" : "border-transparent"}`}
                >
                  <img
                    src={thumb}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`w-full aspect-square object-cover ${lightboxIndex === idx ? "opacity-40" : ""}`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-5 md:py-8 flex items-center justify-between border-b border-gray-200 relative">
        <div className="flex items-center gap-4 md:gap-12">
          <button onClick={toggleMobileMenu} className="md:hidden">
            <img src={iconMenu} alt="Menu" className="w-5 h-5" />
          </button>
          <a href="#" className="flex items-center">
            <img src={logo} alt="sneakers" className="h-5 md:h-6" />
          </a>
          <nav className="hidden md:flex items-center gap-8 text-darkGrayishBlue text-sm font-medium">
            <a href="#" className="hover:text-veryDarkBlue border-b-2 border-transparent hover:border-orange pb-8 -mb-[1.625rem] transition-colors">Collections</a>
            <a href="#" className="hover:text-veryDarkBlue border-b-2 border-transparent hover:border-orange pb-8 -mb-[1.625rem] transition-colors">Men</a>
            <a href="#" className="hover:text-veryDarkBlue border-b-2 border-transparent hover:border-orange pb-8 -mb-[1.625rem] transition-colors">Women</a>
            <a href="#" className="hover:text-veryDarkBlue border-b-2 border-transparent hover:border-orange pb-8 -mb-[1.625rem] transition-colors">About</a>
            <a href="#" className="hover:text-veryDarkBlue border-b-2 border-transparent hover:border-orange pb-8 -mb-[1.625rem] transition-colors">Contact</a>
          </nav>
        </div>
        <div className="flex items-center gap-6 md:gap-8">
          <div className="relative" ref={cartRef}>
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative hover:text-veryDarkBlue transition-colors"
            >
              <img src={iconCart} alt="Cart" className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-4">
                  {totalItems}
                </span>
              )}
            </button>
            {/* Cart Dropdown */}
            {isCartOpen && (
              <div className="absolute right-0 top-12 w-[360px] bg-white rounded-xl shadow-2xl z-50">
                <div className="p-5 border-b border-gray-200 font-bold text-veryDarkBlue text-base">
                  Cart
                </div>
                {cartItems.length === 0 ? (
                  <div className="p-12 text-center text-darkGrayishBlue font-bold text-sm">
                    Your cart is empty.
                  </div>
                ) : (
                  <div className="p-5">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center gap-4 mb-4">
                        <img src={item.thumbnail} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1">
                          <div className="text-darkGrayishBlue text-sm">{item.name}</div>
                          <div className="text-darkGrayishBlue text-sm">
                            ${item.price.toFixed(2)} x {item.qty}{" "}
                            <span className="text-veryDarkBlue font-bold">${(item.price * item.qty).toFixed(2)}</span>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="hover:opacity-75">
                          <img src={iconDelete} alt="Remove" className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button className="w-full bg-orange text-white font-bold py-3 rounded-xl hover:opacity-75 transition-opacity">
                      Checkout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <img src={avatar} alt="Avatar" className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-transparent hover:border-orange cursor-pointer transition-colors" />
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 p-6 shadow-xl">
          <button onClick={toggleMobileMenu} className="mb-8">
            <img src={iconClose} alt="Close" className="w-5 h-5" />
          </button>
          <nav className="flex flex-col gap-5 text-veryDarkBlue font-bold text-lg">
            <a href="#" className="hover:text-orange">Collections</a>
            <a href="#" className="hover:text-orange">Men</a>
            <a href="#" className="hover:text-orange">Women</a>
            <a href="#" className="hover:text-orange">About</a>
            <a href="#" className="hover:text-orange">Contact</a>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6 md:py-12">
        <div className="flex flex-col md:flex-row md:gap-16 lg:gap-24 md:items-start">
          {/* Gallery */}
          <div className="md:w-1/2">
            <div className="relative">
              <button
                onClick={() => openLightbox(selectedIndex)}
                className="w-full block"
              >
                <img
                  src={productImages[selectedIndex]}
                  alt="Product"
                  className="w-full rounded-xl md:rounded-2xl aspect-square object-cover cursor-pointer"
                />
              </button>
              {/* Mobile nav buttons */}
              {isMobile && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:text-orange transition-colors"
                  >
                    <img src={iconPrev} alt="Previous" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:text-orange transition-colors"
                  >
                    <img src={iconNext} alt="Next" className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            <div className="hidden md:flex gap-4 mt-6">
              {thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-24 rounded-xl overflow-hidden border-2 transition-all ${selectedIndex === idx ? "border-orange" : "border-transparent"}`}
                >
                  <img
                    src={thumb}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`w-full aspect-square object-cover ${selectedIndex === idx ? "opacity-40" : ""}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 mt-6 md:mt-0">
            <div className="text-orange text-xs font-bold uppercase tracking-widest mb-3">
              SNEAKER COMPANY
            </div>
            <h1 className="text-veryDarkBlue text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Fall Limited Edition Sneakers
            </h1>
            <p className="text-darkGrayishBlue text-base leading-relaxed mb-6">
              These low-profile sneakers are your perfect casual wear companion.
              Featuring a durable rubber outer sole, they'll withstand everything
              the weather can offer.
            </p>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-veryDarkBlue text-2xl font-bold">$125.00</span>
              <span className="bg-paleOrange text-orange font-bold text-sm px-3 py-0.5 rounded-lg">50%</span>
            </div>
            <div className="text-grayishBlue text-base font-medium line-through mb-6">
              $250.00
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center bg-lightGrayishBlue rounded-xl overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-4 py-3 hover:text-orange transition-colors"
                >
                  <img src={iconMinus} alt="Minus" className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-veryDarkBlue">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-4 py-3 hover:text-orange transition-colors"
                >
                  <img src={iconPlus} alt="Plus" className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={addToCart}
                className="flex-1 bg-orange text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:opacity-75 transition-opacity shadow-lg shadow-orange/30"
              >
                <img src={iconCart} alt="Cart" className="w-5 h-5 filter brightness-0 invert" />
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');
        .font-kumbh { font-family: 'Kumbh Sans', sans-serif; }
      `}</style>
    </div>
  );
}

export default App;