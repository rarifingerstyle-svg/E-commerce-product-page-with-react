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
  const [quantity, setQuantity] = useState(1);
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
    setQuantity(Math.max(1, quantity + delta));
  };

  const addToCart = () => {
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
    setQuantity(1);
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

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

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="font-kumbh min-h-screen bg-white relative">
      {/* Overlay untuk mobile menu & lightbox */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/75 z-40" onClick={toggleMobileMenu} />
      )}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center" onClick={closeLightbox}>
          <div className="relative max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-[#ff7d1a] transition-colors"
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
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:text-[#ff7d1a] transition-colors"
              >
                <img src={iconPrev} alt="Previous" className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:text-[#ff7d1a] transition-colors"
              >
                <img src={iconNext} alt="Next" className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              {thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-20 rounded-xl overflow-hidden border-2 transition-all ${lightboxIndex === idx ? "border-[#ff7d1a]" : "border-transparent"}`}
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
          <nav className="hidden md:flex items-center gap-8 text-slate-500 text-sm font-medium">
            <a href="#" className="hover:text-black border-b-2 border-transparent hover:border-[#ff7d1a] pb-8 -mb-[1.625rem] transition-colors">Collections</a>
            <a href="#" className="hover:text-black border-b-2 border-transparent hover:border-[#ff7d1a] pb-8 -mb-[1.625rem] transition-colors">Men</a>
            <a href="#" className="hover:text-black border-b-2 border-transparent hover:border-[#ff7d1a] pb-8 -mb-[1.625rem] transition-colors">Women</a>
            <a href="#" className="hover:text-black border-b-2 border-transparent hover:border-[#ff7d1a] pb-8 -mb-[1.625rem] transition-colors">About</a>
            <a href="#" className="hover:text-black border-b-2 border-transparent hover:border-[#ff7d1a] pb-8 -mb-[1.625rem] transition-colors">Contact</a>
          </nav>
        </div>
        <div className="flex items-center gap-6 md:gap-8">
          <div className="relative" ref={cartRef}>
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative hover:opacity-75 transition-opacity"
            >
              <img src={iconCart} alt="Cart" className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ff7d1a] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-4">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Cart Dropdown */}
            {isCartOpen && (
              <div className="absolute right-0 top-12 w-[360px] bg-white rounded-xl shadow-2xl z-50 border border-gray-100">
                <div className="p-5 border-b border-gray-200 font-bold text-slate-800 text-base">
                  Cart
                </div>
                {cartItems.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 font-bold text-sm">
                    Your cart is empty.
                  </div>
                ) : (
                  <div className="p-5">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center gap-4 mb-6">
                        <img src={item.thumbnail} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1">
                          <div className="text-slate-500 text-sm">{item.name}</div>
                          <div className="text-slate-500 text-sm">
                            ${item.price.toFixed(2)} x {item.qty}{" "}
                            <span className="text-slate-900 font-bold">${(item.price * item.qty).toFixed(2)}</span>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="hover:opacity-75">
                          <img src={iconDelete} alt="Remove" className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Tombol Checkout (Perbaikan Warna Oranye Asli) */}
                    <button className="w-full bg-[#ff7d1a] hover:bg-[#ffab6a] text-white font-bold py-4 rounded-xl transition-colors shadow-md cursor-pointer block text-center">
                      Checkout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <img src={avatar} alt="Avatar" className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-transparent hover:border-[#ff7d1a] cursor-pointer transition-colors" />
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 p-6 shadow-xl">
          <button onClick={toggleMobileMenu} className="mb-8">
            <img src={iconClose} alt="Close" className="w-5 h-5" />
          </button>
          <nav className="flex flex-col gap-5 text-slate-900 font-bold text-lg">
            <a href="#" className="hover:text-[#ff7d1a]">Collections</a>
            <a href="#" className="hover:text-[#ff7d1a]">Men</a>
            <a href="#" className="hover:text-[#ff7d1a]">Women</a>
            <a href="#" className="hover:text-[#ff7d1a]">About</a>
            <a href="#" className="hover:text-[#ff7d1a]">Contact</a>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6 md:py-12">
        <div className="flex flex-col md:flex-row md:gap-16 lg:gap-24 md:items-center">
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:text-[#ff7d1a] transition-colors"
                  >
                    <img src={iconPrev} alt="Previous" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:text-[#ff7d1a] transition-colors"
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
                  className={`w-24 rounded-xl overflow-hidden border-2 transition-all ${selectedIndex === idx ? "border-[#ff7d1a] opacity-60" : "border-transparent"}`}
                >
                  <img
                    src={thumb}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 mt-6 md:mt-0">
            <div className="text-[#ff7d1a] text-xs font-bold uppercase tracking-widest mb-3">
              SNEAKER COMPANY
            </div>
            <h1 className="text-slate-900 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Fall Limited Edition Sneakers
            </h1>
            <p className="text-slate-500 text-base leading-relaxed mb-6">
              These low-profile sneakers are your perfect casual wear companion.
              Featuring a durable rubber outer sole, they'll withstand everything
              the weather can offer.
            </p>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-slate-900 text-2xl font-bold">$125.00</span>
              <span className="bg-[#ffeee2] text-[#ff7d1a] font-bold text-sm px-3 py-0.5 rounded-lg">50%</span>
            </div>
            <div className="text-slate-400 text-base font-medium line-through mb-6">
              $250.00
            </div>

            {/* Bagian Kontrol Quantity & Tombol Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center justify-between bg-slate-100 rounded-xl px-4 py-3.5 sm:w-36">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="hover:opacity-60 transition-opacity p-1 cursor-pointer"
                >
                  <img src={iconMinus} alt="Minus" className="w-3 h-3" />
                </button>
                <span className="font-bold text-slate-900 text-base select-none">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="hover:opacity-60 transition-opacity p-1 cursor-pointer"
                >
                  <img src={iconPlus} alt="Plus" className="w-3 h-3" />
                </button>
              </div>

              {/* Tombol Add to Cart (Perbaikan Warna Oranye Asli) */}
              <button
                onClick={addToCart}
                className="flex-1 bg-[#ff7d1a] hover:bg-[#ffab6a] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-[#ff7d1a]/30 cursor-pointer"
              >
                <img src={iconCart} alt="Cart" className="w-5 h-5 filter brightness-0 invert" />
                <span>Add to cart</span>
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
