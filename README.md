# Brabus Barbershop - Luxury Management System

![Brabus Barbershop](https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1200)

## 🏁 Sobre la Aplicación

**Brabus Barbershop** es una plataforma de gestión de alta gama diseñada para barberías que buscan un equilibrio entre funcionalidad avanzada y una estética de lujo. Inspirada en la exclusividad y el minimalismo, la aplicación permite a los profesionales gestionar su jornada laboral, registrar servicios y visualizar su rendimiento en tiempo real a través de una interfaz sofisticada en modo oscuro con acentos dorados.

---

## 🚀 ¿Qué se puede hacer ahora mismo? (Estado Actual)

Actualmente, la aplicación se encuentra en una fase de prototipo funcional avanzado con las siguientes características operativas:

### 1. Gestión de Turnos (Shift Control)
*   **Control de Estado:** El barbero puede marcar el inicio de su turno, tomar descansos y realizar el cierre de jornada.
*   **Indicador Visual:** Un indicador de estado dinámico (Verde/Naranja/Gris) muestra si el profesional está activo, en pausa o fuera de servicio.

### 2. Registro de Servicios en Tiempo Real
*   **Panel de Acción:** Acceso rápido a la creación de nuevos servicios (habilitado solo durante el turno activo).
*   **Detalles del Trabajo:** Registro de técnicas aplicadas, horario de inicio/fin, método de pago y precio final.

### 3. Dashboard Al Día (Real-Time Stats)
*   **KPIS de Rendimiento:** Visualización instantánea del total de clientes atendidos y el ingreso bruto generado en el turno actual.
*   **Historial Visual:** Lista detallada de "Trabajos Realizados" con un diseño limpio y elegante.

### 4. Analítica de Servicios
*   **Gráfico Dinámico:** Una gráfica circular interactiva que categoriza automáticamente los trabajos realizados (Cortes, Barba, Otros) para dar una visión clara de la productividad.

### 5. Interfaz de Lujo
*   **Estética Premium:** Uso de paleta de colores *Dark Slate* y *Gold*, efectos de *glassmorphism* y tipografía moderna.
*   **Experiencia de Usuario:** Micro-interacciones y estados condicionales para evitar errores (ej. no registrar servicios si el turno no ha iniciado).

---

## 🔮 Futuras Implementaciones

El roadmap de la aplicación incluye las siguientes mejoras clave:

*   **Persistencia de Datos (Backend):** Conexión con una base de datos real (PostgreSQL/Node.js) para guardar la información a largo plazo.
*   **Autenticación Segura:** Sistema de Login para múltiples barberos con perfiles personalizados.
*   **Gestión de Inventario:** Control de productos (pomadas, aceites, after-shave) utilizados en cada servicio.
*   **Agenda de Citas:** Módulo para que los clientes reserven turnos online con recordatorios automáticos.
*   **Panel de Administración Global:** Vista para el dueño del negocio con métricas de todos los barberos, gastos y utilidades netas.

---

## 🛠️ Pasos Lógicos a Seguir (Next Steps)

Para escalar este proyecto de manera profesional, los pasos recomendados son:

1.  **Migrar a API Real:** Reemplazar el estado local de React por llamadas a una API para que los datos no se borren al refrescar la página.
2.  **Módulo de Clientes:** Implementar una base de datos de clientes frecuentes para agilizar el registro y ofrecer un trato personalizado.
3.  **Sistema de Comisones:** Automatizar el cálculo de pagos para el barbero basado en porcentajes configurables por la administración.
4.  **Optimización Móvil (PWA):** Convertir la app en una Aplicación Web Progresiva para que los barberos la usen cómodamente desde sus smartphones en el puesto de trabajo.

---

## 💻 Tech Stack

*   **Core:** React 19 + Vite
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion
*   **Icons:** Lucide React & React Icons
*   **Design:** Custom Dark/Gold Premium Theme

---
*Desarrollado con ❤️ para Brabus Barbershop.*
