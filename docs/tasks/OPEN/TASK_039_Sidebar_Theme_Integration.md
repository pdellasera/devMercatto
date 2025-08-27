# Task 039: Sidebar Theme Integration (Web)

**Status**: OPEN  
**Priority**: High  
**Estimated Time**: 45 minutes  
**Assigned**: AI  
**Dependencies**: TASK_037 (MainLayout Theme Integration)

## 🎯 Objective
Integrar el sistema de temas en el componente Sidebar.tsx para que todos los elementos visuales (textos, fondos, bordes, iconos) se adapten correctamente al tema activo (light/dark).

## 📋 Acceptance Criteria
- [ ] Sidebar.tsx importa correctamente el hook `useTheme`
- [ ] Los textos `text-white` cambian a colores apropiados para cada tema
- [ ] Los fondos y bordes se adaptan al tema activo
- [ ] Los iconos de menú se adaptan al tema activo
- [ ] Los estados hover y active se adaptan al tema
- [ ] Se usa la utility `cn()` para clases condicionales
- [ ] El componente mantiene su funcionalidad existente
- [ ] La compilación es exitosa sin errores

## 🔧 Implementation Notes
- **Archivo objetivo**: `src/components/layout/Sidebar.tsx`
- **Cambios principales**:
  - Actualizar textos: `text-white` → condicional (líneas 170, 230, 274)
  - Actualizar fondos de elementos de menú
  - Actualizar colores de iconos
  - Actualizar estados hover y active
  - Actualizar bordes y separadores
- **Patrón a seguir**: Usar el mismo patrón implementado en otros componentes
- **Importaciones necesarias**: `useTheme` hook y `cn` utility

## 📊 Validation Method
1. Verificar que el archivo compila sin errores
2. Probar cambio de tema y confirmar que todos los elementos cambian correctamente
3. Verificar que los estados hover y active funcionan en ambos temas
4. Verificar que no hay regresiones en la funcionalidad existente
5. Confirmar que la navegación funciona correctamente

## 📁 Evidence Requirements
- [ ] Código actualizado en Sidebar.tsx
- [ ] Compilación exitosa (`npm run build`)
- [ ] Captura de pantalla mostrando el sidebar en tema claro
- [ ] Captura de pantalla mostrando el sidebar en tema oscuro
- [ ] Verificación de que no hay errores de linter
- [ ] Confirmación de que la navegación funciona correctamente

---

## 📝 Progress Log
**Started**: [Pending]  
**Updates**: 
- [2024-12-19 15:30]: Tarea creada

**Completed**: [Pending]  
**Evidence**: [Pending]
