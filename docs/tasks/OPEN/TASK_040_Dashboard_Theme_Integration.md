# Task 040: Dashboard Theme Integration (Web)

**Status**: OPEN  
**Priority**: High  
**Estimated Time**: 60 minutes  
**Assigned**: AI  
**Dependencies**: TASK_037 (MainLayout Theme Integration), TASK_038 (Header Theme Integration), TASK_039 (Sidebar Theme Integration)

## 🎯 Objective
Integrar el sistema de temas en el componente Dashboard.tsx para que todos los elementos visuales (tabla, cards, filtros, botones) se adapten correctamente al tema activo (light/dark).

## 📋 Acceptance Criteria
- [ ] Dashboard.tsx importa correctamente el hook `useTheme`
- [ ] Las columnas de la tabla se adaptan al tema activo
- [ ] Los cards y contenedores se adaptan al tema
- [ ] Los filtros y controles se adaptan al tema
- [ ] Los botones y elementos interactivos se adaptan al tema
- [ ] Se pasa la prop `theme` a componentes hijos cuando sea necesario
- [ ] Se usa la utility `cn()` para clases condicionales
- [ ] El componente mantiene su funcionalidad existente
- [ ] La compilación es exitosa sin errores

## 🔧 Implementation Notes
- **Archivo objetivo**: `src/pages/Dashboard.tsx`
- **Cambios principales**:
  - Actualizar configuración de columnas de tabla para usar `resolvedTheme`
  - Actualizar colores de cards y contenedores
  - Actualizar colores de filtros y controles
  - Actualizar colores de botones y elementos interactivos
  - Pasar `theme` prop a componentes hijos que lo necesiten
- **Patrón a seguir**: Usar el mismo patrón implementado en DashboardMobile.tsx
- **Importaciones necesarias**: `useTheme` hook y `cn` utility

## 📊 Validation Method
1. Verificar que el archivo compila sin errores
2. Probar cambio de tema y confirmar que todos los elementos cambian correctamente
3. Verificar que la tabla se renderiza correctamente en ambos temas
4. Verificar que los filtros y controles funcionan en ambos temas
5. Verificar que no hay regresiones en la funcionalidad existente
6. Confirmar que el patrón es consistente con DashboardMobile

## 📁 Evidence Requirements
- [ ] Código actualizado en Dashboard.tsx
- [ ] Compilación exitosa (`npm run build`)
- [ ] Captura de pantalla mostrando el dashboard en tema claro
- [ ] Captura de pantalla mostrando el dashboard en tema oscuro
- [ ] Verificación de que no hay errores de linter
- [ ] Confirmación de que la tabla y filtros funcionan correctamente

---

## 📝 Progress Log
**Started**: [Pending]  
**Updates**: 
- [2024-12-19 15:30]: Tarea creada

**Completed**: [Pending]  
**Evidence**: [Pending]
