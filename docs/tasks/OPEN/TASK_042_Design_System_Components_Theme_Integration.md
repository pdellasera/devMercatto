# Task 042: Design System Components Theme Integration

**Status**: OPEN  
**Priority**: Medium  
**Estimated Time**: 90 minutes  
**Assigned**: AI  
**Dependencies**: TASK_037 (MainLayout Theme Integration), TASK_038 (Header Theme Integration), TASK_039 (Sidebar Theme Integration)

## 🎯 Objective
Integrar el sistema de temas en todos los componentes del design system para que se adapten correctamente al tema activo (light/dark).

## 📋 Acceptance Criteria
- [ ] Todos los componentes del design system importan correctamente el hook `useTheme`
- [ ] Los componentes Card se adaptan al tema activo
- [ ] Los componentes Button se adaptan al tema activo
- [ ] Los componentes Input se adaptan al tema activo
- [ ] Los componentes Modal se adaptan al tema activo
- [ ] Los componentes Avatar se adaptan al tema activo
- [ ] Se usa la utility `cn()` para clases condicionales
- [ ] Todos los componentes mantienen su funcionalidad existente
- [ ] La compilación es exitosa sin errores

## 🔧 Implementation Notes
- **Archivos objetivo**: `src/design-system/components/**/*.tsx`
- **Componentes principales a actualizar**:
  - Card components
  - Button components
  - Input components
  - Modal components
  - Avatar components
  - Otros componentes UI identificados
- **Cambios principales**:
  - Actualizar colores de fondo
  - Actualizar colores de texto
  - Actualizar colores de bordes
  - Actualizar estados hover y active
  - Actualizar sombras y efectos
- **Patrón a seguir**: Usar el mismo patrón implementado en otros componentes
- **Importaciones necesarias**: `useTheme` hook y `cn` utility

## 📊 Validation Method
1. Verificar que todos los archivos compilan sin errores
2. Probar cambio de tema y confirmar que todos los componentes cambian correctamente
3. Verificar que los estados hover y active funcionan en ambos temas
4. Verificar que no hay regresiones en la funcionalidad existente
5. Confirmar que todos los componentes se renderizan correctamente

## 📁 Evidence Requirements
- [ ] Código actualizado en todos los componentes del design system
- [ ] Compilación exitosa (`npm run build`)
- [ ] Captura de pantalla mostrando componentes en tema claro
- [ ] Captura de pantalla mostrando componentes en tema oscuro
- [ ] Verificación de que no hay errores de linter
- [ ] Confirmación de que todos los componentes funcionan correctamente

---

## 📝 Progress Log
**Started**: [Pending]  
**Updates**: 
- [2024-12-19 15:30]: Tarea creada

**Completed**: [Pending]  
**Evidence**: [Pending]
