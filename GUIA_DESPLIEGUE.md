# 🚀 Guía de Despliegue - Backend Boda Diter y Vivian

## 📋 Plataformas Gratuitas Recomendadas

### 🎯 Render (RECOMENDADA) ⭐
- ✅ 750 horas gratis al mes
- ✅ Fácil de usar
- ✅ Soporte para múltiples ambientes
- ✅ HTTPS automático
- ✅ Deploys automáticos desde GitHub

### Alternativas:
- **Railway**: $5 crédito gratis mensual
- **Fly.io**: 3 VMs gratis
- **Cyclic**: Hosting gratis ilimitado

---

## 🏗️ MÉTODO 1: Despliegue en Render (Recomendado)

### Paso 1: Preparar el Repositorio en GitHub

1. **Inicializar Git** (si no está inicializado):
```bash
git init
git add .
git commit -m "Initial commit - backend boda"
```

2. **Crear dos ramas** (desarrollo y producción):
```bash
# Crear rama de desarrollo
git checkout -b develop
git push -u origin develop

# Volver a main (producción)
git checkout -b main
git push -u origin main
```

3. **Subir a GitHub**:
   - Ve a https://github.com/new
   - Crea un repositorio llamado `boda-backend`
   - NO inicialices con README
   - Ejecuta:
```bash
git remote add origin https://github.com/TU_USUARIO/boda-backend.git
git push -u origin main
git push -u origin develop
```

---

### Paso 2: Configurar Render

1. **Crear cuenta en Render**:
   - Ve a https://render.com
   - Regístrate con tu cuenta de GitHub

2. **Conectar tu repositorio**:
   - Click en "New +"
   - Selecciona "Blueprint"
   - Conecta tu repositorio de GitHub
   - Render detectará automáticamente el archivo `render.yaml`

3. **Configurar variables de entorno**:

   **Para el servicio de DESARROLLO** (`boda-diter-vivian-dev`):
   - `SUPABASE_URL`: Tu URL de Supabase (desarrollo)
   - `SUPABASE_KEY`: Tu key de Supabase (desarrollo)
   - `JWT_SECRET`: Se genera automáticamente

   **Para el servicio de PRODUCCIÓN** (`boda-diter-vivian-prod`):
   - `SUPABASE_URL`: Tu URL de Supabase (producción)
   - `SUPABASE_KEY`: Tu key de Supabase (producción)
   - `JWT_SECRET`: Se genera automáticamente

4. **Deployar**:
   - Click en "Apply"
   - Render creará automáticamente dos servicios:
     - `boda-diter-vivian-dev` (desde rama `develop`)
     - `boda-diter-vivian-prod` (desde rama `main`)

---

### Paso 3: URLs de tus Ambientes

Después del deploy, tendrás dos URLs:

- **Desarrollo**: `https://boda-diter-vivian-dev.onrender.com`
- **Producción**: `https://boda-diter-vivian-prod.onrender.com`

---

## 🏗️ MÉTODO 2: Despliegue Manual en Render

Si prefieres configurar manualmente cada servicio:

### Para DESARROLLO:

1. Dashboard de Render → "New +" → "Web Service"
2. Conecta tu repositorio
3. Configuración:
   - **Name**: `boda-backend-dev`
   - **Region**: Oregon (USA)
   - **Branch**: `develop`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. Variables de entorno:
```
NODE_ENV=development
PORT=10000
SUPABASE_URL=<tu_supabase_url_desarrollo>
SUPABASE_KEY=<tu_supabase_key_desarrollo>
JWT_SECRET=<generar_secret_aleatorio>
```

### Para PRODUCCIÓN:

Repite los pasos anteriores pero:
- **Name**: `boda-backend-prod`
- **Branch**: `main`
- **NODE_ENV**: `production`
- Usa credenciales de Supabase de producción

---

## 🔄 Workflow de Desarrollo

### Desarrollo:
```bash
# Trabajar en rama develop
git checkout develop

# Hacer cambios y commit
git add .
git commit -m "feat: nueva funcionalidad"
git push origin develop

# Render desplegará automáticamente a desarrollo
```

### Producción:
```bash
# Merge de develop a main
git checkout main
git merge develop
git push origin main

# Render desplegará automáticamente a producción
```

---

## 🏗️ MÉTODO 3: Otras Plataformas

### Railway (Alternativa)

1. Ve a https://railway.app
2. Sign up con GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecciona tu repositorio
5. Variables de entorno:
```
NODE_ENV=production
SUPABASE_URL=<tu_url>
SUPABASE_KEY=<tu_key>
JWT_SECRET=<tu_secret>
```
6. Railway detectará automáticamente tu `package.json`

**Para dos ambientes en Railway**:
- Crea dos proyectos: "boda-backend-dev" y "boda-backend-prod"
- Cada uno conectado a ramas diferentes

---

### Fly.io (Alternativa)

1. Instala Fly CLI:
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

2. Login:
```bash
fly auth login
```

3. Crear app de desarrollo:
```bash
fly launch --name boda-backend-dev --region mia
```

4. Crear app de producción:
```bash
fly launch --name boda-backend-prod --region mia
```

5. Configurar secrets:
```bash
# Desarrollo
fly secrets set SUPABASE_URL="<url>" SUPABASE_KEY="<key>" JWT_SECRET="<secret>" -a boda-backend-dev

# Producción
fly secrets set SUPABASE_URL="<url>" SUPABASE_KEY="<key>" JWT_SECRET="<secret>" -a boda-backend-prod
```

6. Deploy:
```bash
fly deploy -a boda-backend-dev
fly deploy -a boda-backend-prod
```

---

## 🔒 Configuración de Supabase

### Crear Dos Proyectos en Supabase:

1. **Proyecto de Desarrollo**:
   - Ve a https://supabase.com
   - Crea un proyecto llamado "boda-dev"
   - Copia la URL y la anon key
   - Úsalas en el ambiente de desarrollo

2. **Proyecto de Producción**:
   - Crea otro proyecto llamado "boda-prod"
   - Copia la URL y la anon key
   - Úsalas en el ambiente de producción

### Configurar CORS en ambos:
```sql
-- En SQL Editor de Supabase
ALTER TABLE IF EXISTS tu_tabla 
SET (enable_rls = true);
```

---

## 📝 Checklist de Despliegue

- [ ] Código subido a GitHub
- [ ] Dos ramas creadas (main y develop)
- [ ] `.env.example` creado
- [ ] `.gitignore` configurado
- [ ] Cuenta en Render/Railway/Fly.io creada
- [ ] Variables de entorno configuradas para desarrollo
- [ ] Variables de entorno configuradas para producción
- [ ] Deploy de desarrollo exitoso
- [ ] Deploy de producción exitoso
- [ ] Pruebas en ambos ambientes

---

## 🧪 Probar los Ambientes

### Desarrollo:
```bash
curl https://tu-app-dev.onrender.com/
```

### Producción:
```bash
curl https://tu-app-prod.onrender.com/
```

Deberías ver el mensaje de bienvenida de tu API.

---

## 🆘 Problemas Comunes

### 1. Error: "Module not found"
**Solución**: Asegúrate de que `postinstall` ejecute `npm run build`

### 2. Error: "Port already in use"
**Solución**: Render asigna automáticamente el puerto, no necesitas especificarlo

### 3. Error: "SUPABASE_URL is required"
**Solución**: Verifica que las variables de entorno estén configuradas en el dashboard

### 4. App se "duerme" después de 15 min
**Solución**: En Render free tier, las apps se suspenden. Primera petición tardará 30-60s

---

## 💡 Consejos Pro

1. **Monitoreo**: Usa los logs de Render/Railway para debugging
2. **Health Checks**: La ruta `/` sirve como health check
3. **Secretos**: NUNCA subas archivos `.env` a GitHub
4. **Tests**: Prueba primero en desarrollo antes de deployar a producción
5. **Rollback**: Si algo falla en producción, revierte el commit en GitHub

---

## 📚 Recursos Adicionales

- [Documentación de Render](https://render.com/docs)
- [Documentación de Railway](https://docs.railway.app)
- [Documentación de Fly.io](https://fly.io/docs)
- [Supabase Docs](https://supabase.com/docs)

---

## ✅ ¡Listo!

Ahora tienes tu backend desplegado en dos ambientes:
- 🟢 **Desarrollo**: Para probar nuevas funcionalidades
- 🔵 **Producción**: Para usuarios reales

¡Tu API está en la nube! 🎉
