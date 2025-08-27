# Task 041: Login Page Theme Integration (Web)

**Status**: OPEN  
**Priority**: Medium  
**Estimated Time**: 30 minutes  
**Assigned**: AI  
**Dependencies**: TASK_037 (MainLayout Theme Integration)

## 🎯 Objective
Integrar el sistema de temas en la página de Login para que todos los elementos visuales (formulario, botones, textos) se adapten correctamente al tema activo (light/dark).

## 📋 Acceptance Criteria
- [ ] Login.tsx importa correctamente el hook `useTheme`
- [ ] El formulario de login se adapta al tema activo
- [ ] Los campos de entrada se adaptan al tema
- [ ] Los botones se adaptan al tema
- [ ] Los textos y etiquetas se adaptan al tema
- [ ] Se usa la utility `cn()` para clases condicionales
- [ ] El componente mantiene su funcionalidad existente
- [ ] La compilación es exitosa sin errores

## 🔧 Implementation Notes
- **Archivo objetivo**: `src/pages/Login.tsx` (si existe) o verificar ubicación
- **Cambios principales**:
  - Actualizar colores de fondo del formulario
  - Actualizar colores de campos de entrada
  - Actualizar colores de botones
  - Actualizar colores de textos y etiquetas
  - Actualizar bordes y sombras
- **Patrón a seguir**: Usar el mismo patrón implementado en otros componentes
- **Importaciones necesarias**: `useTheme` hook y `cn` utility

## 📊 Validation Method
1. Verificar que el archivo compila sin errores
2. Probar cambio de tema y confirmar que todos los elementos cambian correctamente
3. Verificar que el formulario funciona correctamente en ambos temas
4. Verificar que no hay regresiones en la funcionalidad existente
5. Confirmar que la autenticación funciona correctamente

## 📁 Evidence Requirements
- [ ] Código actualizado en Login.tsx
- [ ] Compilación exitosa (`npm run build`)
- [ ] Captura de pantalla mostrando el login en tema claro
- [ ] Captura de pantalla mostrando el login en tema oscuro
- [ ] Verificación de que no hay errores de linter
- [ ] Confirmación de que el formulario funciona correctamente

---

## 📝 Progress Log
**Started**: [Pending]  
**Updates**: 
- [2024-12-19 15:30]: Tarea creada

**Completed**: [Pending]  
**Evidence**: [Pending]
