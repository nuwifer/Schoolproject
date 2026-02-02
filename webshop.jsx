import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Heart, Search, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

// Simulated Google OAuth (in production, use real OAuth)
const initiateGoogleLogin = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: 'Jan de Vries',
        email: 'jan@example.nl',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
      });
    }, 1000);
  });
};

// Sample products data
const generateSampleProducts = () => {
  const products = [
    { id: 1, title: 'Apple iPhone 15 Pro', description: 'Nieuwste Apple smartphone met titanium design', price: 1199, image: 'https://images.unsplash.com/photo-1696446702183-cbd5ab6a0db3?w=400', tags: ['apple', 'telefoon', 'premium'], sales: 245 },
    { id: 2, title: 'Samsung Galaxy S24', description: 'Krachtige Android smartphone', price: 899, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', tags: ['samsung', 'telefoon'], sales: 189 },
    { id: 3, title: 'Apple MacBook Air M3', description: 'Ultradunne laptop met M3 chip', price: 1399, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', tags: ['apple', 'laptop', 'premium'], sales: 167 },
    { id: 4, title: 'Sony WH-1000XM5', description: 'Noise-cancelling koptelefoon', price: 349, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400', tags: ['audio', 'koptelefoon'], sales: 312 },
    { id: 5, title: 'Apple iPad Pro', description: 'Professionele tablet met M2 chip', price: 999, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', tags: ['apple', 'tablet'], sales: 203 },
    { id: 6, title: 'Dell XPS 15', description: 'Krachtige Windows laptop', price: 1599, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400', tags: ['laptop', 'dell'], sales: 134 },
    { id: 7, title: 'Canon EOS R6', description: 'Professionele mirrorless camera', price: 2499, image: 'https://images.unsplash.com/photo-1606980624253-6e16f6b6b72a?w=400', tags: ['camera', 'fotografie'], sales: 89 },
    { id: 8, title: 'Apple Watch Series 9', description: 'Smartwatch met gezondheidsfeatures', price: 449, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400', tags: ['apple', 'smartwatch'], sales: 276 },
    { id: 9, title: 'Bose QuietComfort Earbuds', description: 'Draadloze oordopjes met noise-cancelling', price: 279, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', tags: ['audio', 'oordopjes'], sales: 198 },
    { id: 10, title: 'Nintendo Switch OLED', description: 'Hybride gameconsole met OLED scherm', price: 349, image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400', tags: ['gaming', 'console'], sales: 421 },
    { id: 11, title: 'LG OLED TV 55"', description: '4K OLED televisie met perfect zwart', price: 1299, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', tags: ['tv', 'entertainment'], sales: 156 },
    { id: 12, title: 'DJI Mini 3 Pro', description: 'Compacte drone met 4K camera', price: 759, image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400', tags: ['drone', 'fotografie'], sales: 112 },
    { id: 13, title: 'Apple AirPods Pro', description: 'Draadloze oordopjes met ruisonderdrukking', price: 279, image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400', tags: ['apple', 'audio', 'oordopjes'], sales: 389 },
    { id: 14, title: 'Microsoft Surface Pro 9', description: '2-in-1 laptop met touchscreen', price: 1099, image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400', tags: ['laptop', 'tablet', 'microsoft'], sales: 145 },
    { id: 15, title: 'GoPro Hero 12', description: 'Action camera voor extreme sporten', price: 449, image: 'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=400', tags: ['camera', 'actie'], sales: 234 },
  ];
  return products;
};

export default function Webshop() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(generateSampleProducts());
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [savedItems, setSavedItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'login', 'register', 'profile', 'cart', 'saved', 'addProduct', 'editProduct'
  const [loginLoading, setLoginLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    tags: ''
  });

  const itemsPerPage = 9;

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = products.filter(product => {
      const searchLower = searchQuery.toLowerCase();
      return product.title.toLowerCase().includes(searchLower) ||
             product.description.toLowerCase().includes(searchLower) ||
             product.tags.some(tag => tag.toLowerCase().includes(searchLower));
    });

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => b.sales - a.sales);
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    const userData = await initiateGoogleLogin();
    setUser(userData);
    setLoginLoading(false);
    setActiveModal(null);
  };

  const handleLogout = () => {
    setUser(null);
    setShowDropdown(false);
  };

  const toggleSave = (productId) => {
    setSavedItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (productId) => {
    setCartItems(prev => [...prev, productId]);
  };

  const removeFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddProduct = () => {
    if (!productForm.title || !productForm.description || !productForm.price) {
      alert('Vul alle verplichte velden in');
      return;
    }

    const newProduct = {
      id: Date.now(),
      title: productForm.title,
      description: productForm.description,
      price: parseFloat(productForm.price),
      image: productForm.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      tags: productForm.tags.split(',').map(t => t.trim()).filter(t => t),
      sales: 0,
      userId: user.id
    };

    setProducts(prev => [newProduct, ...prev]);
    setProductForm({ title: '', description: '', price: '', image: '', tags: '' });
    setActiveModal(null);
  };

  const handleEditProduct = () => {
    setProducts(prev => prev.map(p => 
      p.id === editingProduct.id 
        ? { ...editingProduct, ...productForm }
        : p
    ));
    setEditingProduct(null);
    setProductForm({ title: '', description: '', price: '', image: '', tags: '' });
    setActiveModal(null);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setDeleteConfirm(null);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      tags: product.tags.join(', ')
    });
    setActiveModal('editProduct');
  };

  const getUserProducts = () => {
    return products.filter(p => p.userId === user?.id);
  };

  const getSavedProducts = () => {
    return products.filter(p => savedItems.includes(p.id));
  };

  const getCartProducts = () => {
    return cartItems.map(id => products.find(p => p.id === id)).filter(Boolean);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '"Poppins", sans-serif',
      color: '#1a202c'
    }}>
      {/* Load Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '20px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '30px'
        }}>
          {/* Logo */}
          <div 
            onClick={() => { setCurrentPage(1); setSearchQuery(''); }}
            style={{
              cursor: 'pointer',
              fontFamily: '"Playfair Display", serif',
              fontSize: '32px',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            ShopNL
          </div>

          {/* Search Bar */}
          <div style={{
            flex: 1,
            maxWidth: '600px',
            position: 'relative'
          }}>
            <Search style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              width: '20px',
              height: '20px'
            }} />
            <input
              type="text"
              placeholder="Zoek producten..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                padding: '16px 20px 16px 55px',
                border: '2px solid #e5e7eb',
                borderRadius: '50px',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s ease',
                background: '#f9fafb'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.background = '#fff';
                e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = '#f9fafb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* User Menu */}
          <div style={{ position: 'relative' }}>
            {user ? (
              <div>
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    padding: '8px 16px',
                    borderRadius: '50px',
                    background: showDropdown ? '#f3f4f6' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.background = showDropdown ? '#f3f4f6' : 'transparent'}
                >
                  <img src={user.avatar} alt={user.name} style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid #667eea'
                  }} />
                  <span style={{ fontWeight: 600, fontSize: '15px' }}>{user.name}</span>
                </div>

                {showDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '60px',
                    right: 0,
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                    minWidth: '220px',
                    overflow: 'hidden',
                    animation: 'slideDown 0.3s ease'
                  }}>
                    <div
                      onClick={() => { setActiveModal('profile'); setShowDropdown(false); }}
                      style={{
                        padding: '16px 20px',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontWeight: 500
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <User size={18} />
                      Profiel
                    </div>
                    <div
                      onClick={() => { setActiveModal('saved'); setShowDropdown(false); }}
                      style={{
                        padding: '16px 20px',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontWeight: 500
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Heart size={18} />
                      Opgeslagen ({savedItems.length})
                    </div>
                    <div
                      onClick={() => { setActiveModal('cart'); setShowDropdown(false); }}
                      style={{
                        padding: '16px 20px',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontWeight: 500
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <ShoppingCart size={18} />
                      Winkelwagen ({cartItems.length})
                    </div>
                    <div style={{ height: '1px', background: '#e5e7eb', margin: '8px 0' }} />
                    <div
                      onClick={handleLogout}
                      style={{
                        padding: '16px 20px',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                        fontWeight: 500,
                        color: '#dc2626'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      Uitloggen
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setActiveModal('login')}
                style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }}
              >
                Inloggen / Registreren
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 40px 80px'
      }}>
        {/* Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '20px 30px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#374151'
          }}>
            {filteredProducts.length} producten gevonden
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>Sorteer op:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                outline: 'none',
                background: 'white',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <option value="popular">Meest gekocht</option>
              <option value="price-low">Prijs: Laag naar Hoog</option>
              <option value="price-high">Prijs: Hoog naar Laag</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '50px'
        }}>
          {paginatedProducts.map((product, index) => (
            <div
              key={product.id}
              style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                animation: `fadeInUp 0.5s ease ${index * 0.05}s backwards`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    width: '100%',
                    height: '240px',
                    objectFit: 'cover'
                  }}
                />
                <div
                  onClick={(e) => { e.stopPropagation(); toggleSave(product.id); }}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Heart
                    size={20}
                    fill={savedItems.includes(product.id) ? '#dc2626' : 'none'}
                    color={savedItems.includes(product.id) ? '#dc2626' : '#6b7280'}
                  />
                </div>
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  color: '#1f2937'
                }}>
                  {product.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '16px',
                  lineHeight: '1.5'
                }}>
                  {product.description}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    fontSize: '26px',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    €{product.price}
                  </div>
                  <button
                    onClick={() => addToCart(product.id)}
                    style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    In winkelwagen
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '40px'
          }}>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  padding: '12px 20px',
                  background: currentPage === i + 1 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'white',
                  color: currentPage === i + 1 ? 'white' : '#374151',
                  border: currentPage === i + 1 ? 'none' : '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '50px',
                  boxShadow: currentPage === i + 1 ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== i + 1) {
                    e.target.style.background = '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== i + 1) {
                    e.target.style.background = 'white';
                  }
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '60px 40px 30px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <h3 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '28px',
              fontWeight: 900,
              marginBottom: '16px',
              color: '#fff'
            }}>
              ShopNL
            </h3>
            <p style={{ color: '#9ca3af', lineHeight: '1.6' }}>
              De beste online winkel voor al je technologie behoeften.
            </p>
          </div>
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: 700,
              marginBottom: '16px',
              color: '#fff'
            }}>
              Help
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" style={{
                color: '#9ca3af',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#fff'}
              onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              >
                Support
              </a>
              <a href="#" style={{
                color: '#9ca3af',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#fff'}
              onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              >
                Basis Help
              </a>
            </div>
          </div>
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: 700,
              marginBottom: '16px',
              color: '#fff'
            }}>
              Volg Ons
            </h4>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '44px',
                  height: '44px',
                  background: '#374151',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#667eea';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#374151';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '44px',
                  height: '44px',
                  background: '#374151',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#667eea';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#374151';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '44px',
                  height: '44px',
                  background: '#374151',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#667eea';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#374151';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '30px',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '14px'
        }}>
          © 2026 ShopNL. Alle rechten voorbehouden.
        </div>
      </footer>

      {/* Login Modal */}
      {activeModal === 'login' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '50px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideUp 0.4s ease'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 800,
                margin: 0,
                fontFamily: '"Playfair Display", serif'
              }}>
                Welkom Terug
              </h2>
              <X
                onClick={() => setActiveModal(null)}
                style={{ cursor: 'pointer', color: '#6b7280' }}
                size={24}
              />
            </div>
            <p style={{ color: '#6b7280', marginBottom: '30px', fontSize: '15px' }}>
              Log in met je Google account om door te gaan
            </p>
            <button
              onClick={handleGoogleLogin}
              disabled={loginLoading}
              style={{
                width: '100%',
                padding: '16px',
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: loginLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                transition: 'all 0.2s ease',
                opacity: loginLoading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!loginLoading) e.target.style.background = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                if (!loginLoading) e.target.style.background = 'white';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loginLoading ? 'Inloggen...' : 'Doorgaan met Google'}
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {activeModal === 'profile' && user && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideUp 0.4s ease'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 800,
                margin: 0,
                fontFamily: '"Playfair Display", serif'
              }}>
                Mijn Profiel
              </h2>
              <X
                onClick={() => setActiveModal(null)}
                style={{ cursor: 'pointer', color: '#6b7280' }}
                size={24}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '40px',
              padding: '30px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              color: 'white'
            }}>
              <img src={user.avatar} alt={user.name} style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '4px solid rgba(255, 255, 255, 0.3)'
              }} />
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0' }}>
                  {user.name}
                </h3>
                <p style={{ margin: 0, opacity: 0.9 }}>{user.email}</p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Mijn Producten</h3>
              <button
                onClick={() => {
                  setProductForm({ title: '', description: '', price: '', image: '', tags: '' });
                  setActiveModal('addProduct');
                }}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                <Plus size={18} />
                Product Toevoegen
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {getUserProducts().length === 0 ? (
                <p style={{ color: '#6b7280', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                  Je hebt nog geen producten toegevoegd
                </p>
              ) : (
                getUserProducts().map(product => (
                  <div
                    key={product.id}
                    style={{
                      border: '2px solid #e5e7eb',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#667eea'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                  >
                    <img src={product.image} alt={product.title} style={{
                      width: '100%',
                      height: '160px',
                      objectFit: 'cover'
                    }} />
                    <div style={{ padding: '16px' }}>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        marginBottom: '8px'
                      }}>
                        {product.title}
                      </h4>
                      <p style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '12px'
                      }}>
                        €{product.price}
                      </p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => openEditModal(product)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: '#f3f4f6',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            fontWeight: 600,
                            fontSize: '13px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                          onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                        >
                          <Edit2 size={14} />
                          Bewerken
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            fontWeight: 600,
                            fontSize: '13px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#fecaca'}
                          onMouseLeave={(e) => e.target.style.background = '#fee2e2'}
                        >
                          <Trash2 size={14} />
                          Verwijderen
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {(activeModal === 'addProduct' || activeModal === 'editProduct') && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideUp 0.4s ease'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 800,
                margin: 0,
                fontFamily: '"Playfair Display", serif'
              }}>
                {activeModal === 'addProduct' ? 'Product Toevoegen' : 'Product Bewerken'}
              </h2>
              <X
                onClick={() => {
                  setActiveModal('profile');
                  setEditingProduct(null);
                  setProductForm({ title: '', description: '', price: '', image: '', tags: '' });
                }}
                style={{ cursor: 'pointer', color: '#6b7280' }}
                size={24}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  Titel *
                </label>
                <input
                  type="text"
                  value={productForm.title}
                  onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  Beschrijving *
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  Prijs (€) *
                </label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  Afbeelding URL
                </label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  Tags (gescheiden door komma's)
                </label>
                <input
                  type="text"
                  value={productForm.tags}
                  onChange={(e) => setProductForm({...productForm, tags: e.target.value})}
                  placeholder="telefoon, apple, premium"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <button
                onClick={activeModal === 'addProduct' ? handleAddProduct : handleEditProduct}
                style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                  marginTop: '10px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                {activeModal === 'addProduct' ? 'Product Toevoegen' : 'Wijzigingen Opslaan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1002,
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideUp 0.4s ease'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 800,
              marginBottom: '16px',
              fontFamily: '"Playfair Display", serif'
            }}>
              Product Verwijderen?
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '30px', fontSize: '15px' }}>
              Weet je zeker dat je dit product wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
              >
                Annuleren
              </button>
              <button
                onClick={() => {
                  handleDeleteProduct(deleteConfirm);
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#b91c1c'}
                onMouseLeave={(e) => e.target.style.background = '#dc2626'}
              >
                Verwijderen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Items Modal */}
      {activeModal === 'saved' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideUp 0.4s ease'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 800,
                margin: 0,
                fontFamily: '"Playfair Display", serif'
              }}>
                Opgeslagen Items
              </h2>
              <X
                onClick={() => setActiveModal(null)}
                style={{ cursor: 'pointer', color: '#6b7280' }}
                size={24}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {getSavedProducts().length === 0 ? (
                <p style={{ color: '#6b7280', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                  Je hebt nog geen items opgeslagen
                </p>
              ) : (
                getSavedProducts().map(product => (
                  <div
                    key={product.id}
                    style={{
                      border: '2px solid #e5e7eb',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#667eea'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                  >
                    <img src={product.image} alt={product.title} style={{
                      width: '100%',
                      height: '160px',
                      objectFit: 'cover'
                    }} />
                    <div style={{ padding: '16px' }}>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        marginBottom: '8px'
                      }}>
                        {product.title}
                      </h4>
                      <p style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '12px'
                      }}>
                        €{product.price}
                      </p>
                      <button
                        onClick={() => toggleSave(product.id)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '13px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#fecaca'}
                        onMouseLeave={(e) => e.target.style.background = '#fee2e2'}
                      >
                        Verwijderen
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {activeModal === 'cart' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideUp 0.4s ease'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 800,
                margin: 0,
                fontFamily: '"Playfair Display", serif'
              }}>
                Winkelwagen
              </h2>
              <X
                onClick={() => setActiveModal(null)}
                style={{ cursor: 'pointer', color: '#6b7280' }}
                size={24}
              />
            </div>

            {getCartProducts().length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>
                Je winkelwagen is leeg
              </p>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
                  {getCartProducts().map((product, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        gap: '16px',
                        padding: '16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px'
                      }}
                    >
                      <img src={product.image} alt={product.title} style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          marginBottom: '4px'
                        }}>
                          {product.title}
                        </h4>
                        <p style={{
                          fontSize: '18px',
                          fontWeight: 800,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          €{product.price}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        style={{
                          padding: '8px',
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          height: 'fit-content',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#fecaca'}
                        onMouseLeave={(e) => e.target.style.background = '#fee2e2'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{
                  borderTop: '2px solid #e5e7eb',
                  paddingTop: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <span style={{ fontSize: '20px', fontWeight: 700 }}>Totaal:</span>
                  <span style={{
                    fontSize: '32px',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    €{getCartProducts().reduce((sum, p) => sum + p.price, 0).toFixed(2)}
                  </span>
                </div>

                <button
                  style={{
                    width: '100%',
                    padding: '18px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  Afrekenen
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
