import express from 'express';
import { json, urlencoded } from 'body-parser';
import authRoutes from './routes/auth.routes';
import clientRoutes from './routes/client.routes';
import adminRoutes from './routes/admin.routes';
import availableHealthPlanRoutes from './routes/availableHealthPlan.routes'
import HealthPlanRoutes from './routes/health_plan.routes'
import ProfessionalRoutes from './routes/professional.routes'
import ServiceRoutes from './routes/service.ruoutes'
import GuideRoutes from './routes/guide.routes'
import UserPrincingRoutes from './routes/user_pricing.routes'
// import paymentRoutes from './routes/payment.routes';
// import publicRoutes from './routes/public.routes';
// import errorMiddleware from './middlewares/error.middleware';

const app = express();


app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/admin/users', adminRoutes);
app.use('/api/available_helth_plans', availableHealthPlanRoutes);
app.use('/api/client_health_plans', HealthPlanRoutes);
app.use('/api/professionals', ProfessionalRoutes)
app.use('/api/services', ServiceRoutes)
app.use('/api/guides', GuideRoutes)
app.use('/api/user_pricing', UserPrincingRoutes)
// app.use('/payments', paymentRoutes);
// app.use('/public', publicRoutes);

// app.use(errorMiddleware);

export default app;
