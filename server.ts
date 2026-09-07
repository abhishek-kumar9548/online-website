import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db, verifyPassword, hashPassword, generateId } from './src/server/db.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // -----------------------------------------------------------------
  // SIMPLE TOKEN AUTH HELPER
  // -----------------------------------------------------------------
  function getUserFromHeader(req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [userId] = decoded.split(':');
      if (userId) {
        return db.findUserById(userId);
      }
    } catch {
      return null;
    }
    return null;
  }

  function createToken(userId: string): string {
    return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
  }

  // -----------------------------------------------------------------
  // AUTH API
  // -----------------------------------------------------------------
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }
    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const user = db.createUser({ name, email, password, phone });
    const token = createToken(user.id);
    return res.status(201).json({ user, token });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const userWithHash = db.findUserByEmail(email);
    if (!userWithHash || !verifyPassword(password, userWithHash.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...user } = userWithHash;
    const token = createToken(user.id);
    return res.json({ user, token });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    return res.json({ user });
  });

  app.put('/api/auth/profile', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { name, phone } = req.body;
    const updated = db.updateUser(user.id, { name, phone });
    return res.json({ user: updated });
  });

  app.post('/api/auth/address', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { fullName, addressLine1, addressLine2, city, state, postalCode, country, phone, isDefault } = req.body;
    if (!fullName || !addressLine1 || !city || !state || !postalCode || !phone) {
      return res.status(400).json({ error: 'Missing required address fields.' });
    }

    const newAddress = {
      id: `addr-${generateId()}`,
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country: country || 'India',
      phone,
      isDefault: !!isDefault
    };

    let addresses = [...(user.addresses || [])];
    if (newAddress.isDefault) {
      addresses = addresses.map(a => ({ ...a, isDefault: false }));
    }
    addresses.push(newAddress);
    const updatedUser = db.updateUser(user.id, { addresses });
    return res.status(201).json({ user: updatedUser, address: newAddress });
  });

  app.delete('/api/auth/address/:addressId', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { addressId } = req.params;
    const addresses = (user.addresses || []).filter(a => a.id !== addressId);
    const updatedUser = db.updateUser(user.id, { addresses });
    return res.json({ user: updatedUser });
  });

  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = db.findUserByEmail(email);
    // Even if user not found, return generic success message to prevent user enumeration
    return res.json({ message: 'If an account matches that email, password reset instructions have been sent.' });
  });

  app.post('/api/auth/reset-password', (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required.' });
    }
    const user = db.findUserByEmail(email);
    if (user) {
      user.passwordHash = hashPassword(newPassword);
    }
    return res.json({ message: 'Password has been updated successfully. Please log in.' });
  });

  // -----------------------------------------------------------------
  // CATEGORIES & PRODUCTS API
  // -----------------------------------------------------------------
  app.get('/api/categories', (req: Request, res: Response) => {
    return res.json({ categories: db.getCategories() });
  });

  app.get('/api/products', (req: Request, res: Response) => {
    const {
      categorySlug,
      categoryId,
      search,
      minPrice,
      maxPrice,
      rating,
      inStockOnly,
      sort,
      limit,
      offset
    } = req.query;

    const filters = {
      categorySlug: categorySlug as string,
      categoryId: categoryId as string,
      search: search as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      rating: rating ? Number(rating) : undefined,
      inStockOnly: inStockOnly === 'true',
      sort: sort as any,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined
    };

    const result = db.getProducts(filters);
    return res.json(result);
  });

  app.get('/api/products/:idOrSlug', (req: Request, res: Response) => {
    const { idOrSlug } = req.params;
    let product = db.getProductById(idOrSlug);
    if (!product) {
      product = db.getProductBySlug(idOrSlug);
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const reviews = db.getReviews(product.id);
    const related = db.getProducts({ categoryId: product.categoryId, limit: 4 }).products.filter(p => p.id !== product!.id);
    return res.json({ product, reviews, related });
  });

  // -----------------------------------------------------------------
  // REVIEWS API
  // -----------------------------------------------------------------
  app.get('/api/reviews/:productId', (req: Request, res: Response) => {
    const reviews = db.getReviews(req.params.productId);
    return res.json({ reviews });
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    const { productId, rating, title, comment, userName } = req.body;
    if (!productId || !rating || !title || !comment || !userName) {
      return res.status(400).json({ error: 'All review fields are required.' });
    }
    const user = getUserFromHeader(req);
    const review = db.createReview({
      productId,
      userId: user ? user.id : 'guest-reviewer',
      userName,
      rating: Number(rating),
      title,
      comment,
      verifiedPurchase: true
    });
    return res.status(201).json({ review });
  });

  // -----------------------------------------------------------------
  // COUPONS API
  // -----------------------------------------------------------------
  app.post('/api/coupons/validate', (req: Request, res: Response) => {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Coupon code is required.' });
    }
    const result = db.validateCoupon(code, Number(subtotal) || 0);
    if (!result.valid) {
      return res.status(400).json(result);
    }
    return res.json(result);
  });

  // -----------------------------------------------------------------
  // ORDERS API
  // -----------------------------------------------------------------
  app.post('/api/orders', (req: Request, res: Response) => {
    const {
      customerName,
      customerEmail,
      customerPhone,
      items,
      shippingAddress,
      subtotal,
      discount,
      couponCode,
      shippingFee,
      total,
      paymentMethod
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !items || !items.length || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required order details.' });
    }

    const user = getUserFromHeader(req);

    const newOrder = db.createOrder({
      userId: user?.id,
      customerName,
      customerEmail,
      customerPhone,
      items,
      shippingAddress,
      subtotal: Number(subtotal),
      discount: Number(discount) || 0,
      couponCode,
      shippingFee: Number(shippingFee) || 0,
      total: Number(total),
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'processing'
    });

    return res.status(201).json({ order: newOrder });
  });

  app.get('/api/orders', (req: Request, res: Response) => {
    const user = getUserFromHeader(req);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const orders = db.getOrders(user.role === 'admin' ? undefined : user.id);
    return res.json({ orders });
  });

  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.json({ order });
  });

  // -----------------------------------------------------------------
  // CONTACT & NEWSLETTER API
  // -----------------------------------------------------------------
  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Name, email, subject, and message are required.' });
    }
    const newMsg = db.createContactMessage({ name, email, phone, subject, message });
    return res.status(201).json({ success: true, message: 'Your message has been received. Our festive support team will reply within 24 hours.', data: newMsg });
  });

  app.post('/api/newsletter', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    const result = db.subscribeNewsletter(email);
    return res.json(result);
  });

  // -----------------------------------------------------------------
  // ADMIN API (Secured)
  // -----------------------------------------------------------------
  function requireAdmin(req: Request, res: Response, next: () => void) {
    const user = getUserFromHeader(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin privileges required' });
    }
    next();
  }

  app.get('/api/admin/stats', requireAdmin, (req: Request, res: Response) => {
    return res.json({ stats: db.getAdminStats() });
  });

  app.get('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
    return res.json({ products: db.getProducts({ limit: 100 }).products });
  });

  app.post('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
    const {
      title,
      categoryId,
      categoryName,
      price,
      originalPrice,
      shortDescription,
      description,
      stockQuantity,
      sku,
      images,
      tags,
      specifications
    } = req.body;

    if (!title || !categoryId || !price) {
      return res.status(400).json({ error: 'Title, category, and price are required.' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const discountPercent = originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

    const newProduct = db.createProduct({
      title,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      categoryId,
      categoryName: categoryName || 'Festival Celebrations',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      discountPercent,
      rating: 5.0,
      reviewCount: 0,
      isFeatured: false,
      isBestSeller: false,
      inStock: Number(stockQuantity) > 0,
      stockQuantity: Number(stockQuantity) || 10,
      sku: sku || `SKU-${Math.floor(10000 + Math.random() * 90000)}`,
      shortDescription: shortDescription || title,
      description: description || title,
      specifications: specifications || { 'Origin': 'Handcrafted in India' },
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1605335198031-6e3e57f2ca29?auto=format&fit=crop&w=800&q=80'],
      tags: tags || ['Festive', 'Handmade'],
      safetyCompliance: '100% Non-hazardous, safe festive decorative craft item.'
    });

    return res.status(201).json({ product: newProduct });
  });

  app.put('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = db.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json({ product: updated });
  });

  app.delete('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const success = db.deleteProduct(id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json({ success: true, message: 'Product deleted successfully' });
  });

  app.get('/api/admin/orders', requireAdmin, (req: Request, res: Response) => {
    return res.json({ orders: db.getOrders() });
  });

  app.patch('/api/admin/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const { orderStatus } = req.body;
    if (!orderStatus) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updatedOrder = db.updateOrderStatus(id, orderStatus);
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.json({ order: updatedOrder });
  });

  app.get('/api/admin/customers', requireAdmin, (req: Request, res: Response) => {
    const users = db.getAllUsers();
    return res.json({ customers: users });
  });

  app.get('/api/admin/messages', requireAdmin, (req: Request, res: Response) => {
    return res.json({ messages: db.getContactMessages() });
  });

  // -----------------------------------------------------------------
  // VITE DEV MIDDLEWARE / STATIC PRODUCTION SERVING
  // -----------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Utsav Veda Festive Store server running on http://localhost:${PORT}`);
  });
}

startServer();
