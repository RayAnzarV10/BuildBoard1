# BuildBoard

Este es un software de gestión especializado para PyMEs mexicanas en el sector de construcción y diseño de interiores, permitiendo una administración eficiente de proyectos.

## 🚀 Características

### Gestión de Proyectos
- Seguimiento de estado de proyectos
- Control de presupuestos
- Fechas estimadas de finalización
- Localización geográfica con Google Maps
- Descripción detallada de proyectos

### 📍 Geolocalización
- Integración completa con Google Maps
- Autocompletado en búsqueda de direcciones
- Vista satelital de ubicaciones
- Marcadores interactivos y arrastrables

### 🏢 Organización
- Gestión por organizaciones
- Numeración automática de proyectos
- Sistema de estados para seguimiento

## 🛠️ Tecnologías

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn/ui
- React Google Maps API

### Backend
- Prisma ORM
- Base de datos con soporte JSON

## 📋 Requisitos
- Node.js
- API Key de Google Maps
- Variables de entorno:
  ```
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
  DATABASE_URL=
  ```

## 🔧 Configuración

1. Clonar el repositorio
```bash
git clone [URL_REPOSITORIO]
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env.example .env
```

4. Ejecutar migraciones
```bash
npx prisma migrate dev
```

5. Iniciar servidor de desarrollo
```bash
npm run dev
```

## 📝 Esquema Base de Datos

```prisma
model Project {
  id              String        @id @default(uuid())
  number          Int
  orgId           String
  org             Organization  @relation(fields: [orgId], references: [id], onDelete: Cascade)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  name            String
  status          ProjectStatus
  location        String        @db.Text
  det_location    Json?
  est_completion  DateTime
  budget          Float
  description     String        @db.Text
  incomes         Income[]
  expenses        Expense[]

  @@unique([orgId, number])
  @@index([orgId])
}
```

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama para feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit de cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Crear Pull Request

## 📄 Licencia
[Especificar licencia]

## 📞 Contacto
[Información de contacto]

---
*Proyecto en desarrollo activo - Las funcionalidades pueden ser expandidas o modificadas.*