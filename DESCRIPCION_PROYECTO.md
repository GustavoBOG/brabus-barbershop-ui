# Brabus Barbershop - Luxury Management System

![Brabus Barbershop Logo/Banner](https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1200)

## 📋 Descripción de la Aplicación

**Brabus Barbershop** es una plataforma de gestión integral diseñada para barberías de alta gama. Combina una estética de lujo con herramientas operativas potentes para que los barberos puedan gestionar su jornada, registrar servicios de forma ágil y analizar su rendimiento económico en tiempo real.

La aplicación utiliza un diseño **premium** en modo oscuro (*Dark Slate*) con acentos en dorado (*Gold*) y efectos de *glassmorphism*, proporcionando una experiencia visual sofisticada y profesional.

---

## 🛠️ Stack Tecnológico

La aplicación está construida con las tecnologías más modernas para garantizar velocidad, escalabilidad y una gran experiencia de usuario.

### **Frontend**
-   **Lenguaje:** JavaScript (ES6+)
-   **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) (para un desarrollo ultra rápido).
-   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) (diseño responsivo y moderno).
-   **Animaciones:** [Framer Motion](https://www.framer.com/motion/) (transiciones fluidas y micro-interacciones).
-   **Iconografía:** [Lucide React](https://lucide.dev/) y [React Icons](https://react-icons.github.io/react-icons/).
-   **Enrutado:** [React Router DOM v6](https://reactrouter.com/).
-   **Manejo de Fechas:** [date-fns](https://date-fns.org/).

### **Backend**
-   **Entorno de Ejecución:** [Node.js](https://nodejs.org/).
-   **Framework:** [Express.js v5](https://expressjs.com/).
-   **Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL as a Service).
-   **Middleware:** CORS, Morgan (logs) y Dotenv (variables de entorno).

### **Herramientas y Extensiones**
-   **Calidad de Código:** ESLint.
-   **Procesamiento CSS:** PostCSS y Autoprefixer.
-   **Control de Versiones:** Git & GitHub.

---

## ✅ Funcionalidades Listas (Implemented)

Actualmente, la aplicación es totalmente operativa para el flujo diario de un barbero:

1.  **Gestión de Turnos (Shift Control):**
    -   Iniciar jornada laboral, pausar para descansos y finalizar turno.
    -   Indicadores visuales de estado (Activo, Pausa, Inactivo).
2.  **Registro de Servicios Multitarea:**
    -   Permite registrar varios servicios para un mismo cliente simultáneamente (ej. Corte + Barba + Cejas).
    -   Selección de método de pago (Efectivo, Tarjeta, Transferencia).
3.  **Dashboard en Tiempo Real:**
    -   Tarjetas KPI con total de clientes y dinero generado en el turno actual.
    -   Gráfica interactiva de categorías (Corte vs Barba vs Otros).
4.  **Historial Detallado:**
    -   Sección dedicada para revisar turnos pasados.
    -   Filtros inteligentes: Hoy, Esta Semana, Este Mes, Este Año y rango de fechas personalizado.
    -   Desglose por turno: total bruto, **comisión del 50% para el barbero** y desglose por método de pago.
5.  **Cierre de Jornada (End Shift):**
    -   Modal de resumen que muestra las estadísticas finales antes de cerrar el turno.

---

## ⏳ Implementaciones Pendientes (Roadmap)

Para convertir Brabus en una herramienta 360°, faltan las siguientes fases:

-   **[ ] Autenticación de Usuarios:** Sistema de login seguro para que cada barbero tenga su propia cuenta privada.
-   **[ ] Base de Datos de Clientes (CRM):** Registrar clientes recurrentes, sus preferencias y frecuencia de visita.
-   **[ ] Gestión de Inventario:** Control de stock de productos de barbería y ventas de productos retail (pomadas, aceites).
-   **[ ] Agenda de Citas Online:** Módulo para que los clientes reserven turnos desde la web.
-   **[ ] Panel Administrativo:** Vista global para el dueño del local con métricas de todos los barberos y gastos operativos.
-   **[ ] PWA (Progressive Web App):** Optimización para instalar la app en móviles y soporte offline básico.

---

*Desarrollado con enfoque en la excelencia por el equipo de Brabus Barbershop.*
