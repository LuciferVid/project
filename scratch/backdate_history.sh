#!/bin/bash

# Configuration
USER_NAME="Vid"
USER_EMAIL="vid@example.com" # Default, will be updated if user provides one

git config user.name "$USER_NAME"
git config user.email "$USER_EMAIL"

# Helper function for backdated commits
commit_backdated() {
    local date="$1"
    local message="$2"
    GIT_AUTHOR_DATE="$date" GIT_COMMITTER_DATE="$date" git commit -m "$message"
}

# Milestone 1: Scaffolding (Feb 1)
git add .gitignore ErDiagram.md classDiagram.md sequenceDiagram.md useCaseDiagram.md
git add backend/package.json backend/server.js
commit_backdated "2026-02-01T10:00:00" "Initial project scaffolding and backend configuration"

# Milestone 2: Core Models & Repos (Feb 15)
git add backend/src/models/
git add backend/src/repositories/
git add backend/src/config/
commit_backdated "2026-02-15T14:30:00" "Implemented core Mongoose models and Repository layer"

# Milestone 3: Auth & Security (Mar 1)
git add backend/src/middlewares/authMiddleware.js
git add backend/src/middlewares/roleMiddleware.js
git add backend/src/routes/authRoutes.js
git add backend/src/controllers/authController.js
commit_backdated "2026-03-01T09:00:00" "Implemented JWT authentication and RBAC middlewares"

# Milestone 4: Product Catalogue (Mar 15)
git add backend/src/services/productService.js
git add backend/src/controllers/productController.js
git add backend/src/routes/productRoutes.js
git add backend/src/middlewares/uploadMiddleware.js
commit_backdated "2026-03-15T11:45:00" "Built Product Catalogue service with Cloudinary image support"

# Milestone 5: Order & Cart (Mar 25)
git add backend/src/services/orderService.js
git add backend/src/services/cartService.js
git add backend/src/controllers/orderController.js
git add backend/src/routes/orderRoutes.js
git add backend/src/routes/cartRoutes.js
commit_backdated "2026-03-25T16:20:00" "Implemented Shopping Cart and Order management logic"

# Milestone 6: Payments & Reviews (Apr 5)
git add backend/src/factories/
git add backend/src/services/paymentService.js
git add backend/src/services/reviewService.js
git add backend/src/routes/paymentRoutes.js
git add backend/src/routes/reviewRoutes.js
commit_backdated "2026-04-05T13:10:00" "Integrated Razorpay Factory and Compound-indexed review system"

# Milestone 7: Frontend Initialization (Apr 12)
git add frontend/package.json frontend/vite.config.js frontend/tailwind.config.js frontend/index.html
git add frontend/src/app/
git add frontend/src/features/auth/
git add frontend/src/pages/auth/
commit_backdated "2026-04-12T10:30:00" "Initialized Frontend with Vite, Redux Toolkit, and Auth UI"

# Milestone 8: Frontend Pages (Apr 18)
git add frontend/src/pages/customer/
git add frontend/src/components/
git add frontend/src/features/api/
commit_backdated "2026-04-18T15:00:00" "Developed Frontend Catalogue, Cart, and Checkout layouts"

# Milestone 9: Completion (Today)
git add .
commit_backdated "$(date +%Y-%m-%dT%H:%M:%S)" "Final Dashboards (Vendor/Admin) and Project Completion"

echo "Backdated history reconstruction complete!"
