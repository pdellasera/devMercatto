# Task 043: Table Component Theme Integration (Web)

**Status**: OPEN  
**Priority**: Medium  
**Estimated Time**: 45 minutes  
**Assigned**: AI  
**Dependencies**: TASK_040 (Dashboard Theme Integration)

## 🎯 Objective
Integrar el sistema de temas en el componente Table.tsx para que todos los elementos visuales (headers, rows, pagination) se adapten correctamente al tema activo (light/dark).

## 📋 Acceptance Criteria
- [ ] Table.tsx importa correctamente el hook `useTheme`
- [ ] Los headers de la tabla se adaptan al tema activo
- [ ] Las filas de la tabla se adaptan al tema activo
- [ ] La paginación se adapta al tema activo
- [ ] Los estados hover y active se adaptan al tema
- [ ] Se usa la utility `cn()` para clases condicionales
- [ ] El componente mantiene su funcionalidad existente
- [ ] La compilación es exitosa sin errores

## 🔧 Implementation Notes
- **Archivo objetivo**: `src/components/ui/Table.tsx`
- **Cambios principales**:
  - Actualizar colores de headers de tabla
  - Actualizar colores de filas de tabla
  - Actualizar colores de paginación
  - Actualizar estados hover y active
  - Actualizar bordes y separadores
- **Patrón a seguir**: Usar el mismo patrón implementado en TableMobile.tsx
- **Importaciones necesarias**: `useTheme` hook y `cn` utility

## 📊 Validation Method
1. Verificar que el archivo compila sin errores
2. Probar cambio de tema y confirmar que todos los elementos cambian correctamente
3. Verificar que los estados hover y active funcionan en ambos temas
4. Verificar que la paginación funciona correctamente en ambos temas
5. Verificar que no hay regresiones en la funcionalidad existente
6. Confirmar que el patrón es consistente con TableMobile

## 📁 Evidence Requirements
- [ ] Código actualizado en Table.tsx
- [ ] Compilación exitosa (`npm run build`)
- [ ] Captura de pantalla mostrando la tabla en tema claro
- [ ] Captura de pantalla mostrando la tabla en tema oscuro
- [ ] Verificación de que no hay errores de linter
- [ ] Confirmación de que la tabla y paginación funcionan correctamente

---

## 📝 Progress Log
**Started**: [Pending]  
**Updates**: 
- [2024-12-19 15:30]: Tarea creada

**Completed**: [Pending]  
**Evidence**: [Pending]
