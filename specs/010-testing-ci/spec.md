# Spec 010: Testing y CI/CD

## Estado
Borrador

## Contexto
El proyecto no tiene ninguna prueba automatizada ni pipeline de CI.
Esta spec agrega un set inicial de tests (unitarios/componentes) con
Vitest + Testing Library, un Error Boundary para fallos de render no
controlados, y un workflow de GitHub Actions que corre lint + tests +
build en cada push/PR.

## Qué queremos

1. **Como desarrollador**, quiero poder correr `bun run test` y ver
   pruebas automatizadas pasar/fallar.
2. **Como desarrollador**, quiero pruebas para la lógica pura más
   propensa a bugs silenciosos (validación de username, formato de
   fecha, traducción de errores de auth) sin necesidad de mockear
   Supabase completo.
3. **Como desarrollador**, quiero al menos un test de componente que
   verifique comportamiento de UI (ej. que `ConfirmDialog` no renderiza
   nada si `open` es `false`, y sí renderiza su contenido si es `true`).
4. **Como usuario**, si algo falla inesperadamente al renderizar
   (un error no controlado), quiero ver una pantalla de error amigable
   en vez de una página en blanco.
5. **Como desarrollador**, quiero que cada push a GitHub corra
   automáticamente lint, tests y build, y que se vea el resultado
   (✅/❌) directamente en el repositorio.

## Fuera de alcance para esta spec
- Cobertura de tests exhaustiva de todo el proyecto (se prioriza lógica
  pura y un ejemplo de componente, no 100% de cobertura).
- Tests end-to-end (Playwright/Cypress) contra Supabase real — se deja
  como posible spec futura.
- Deploy automático desde GitHub Actions (solo se valida el código, no
  se publica).

## Criterios de aceptación

- [ ] `bun run test` ejecuta la suite de pruebas y muestra resultados
      claros en consola.
- [ ] Existen pruebas para: validación de username (spec 006), formato
      de fecha de tarjetas (spec 004), traducción de errores de auth
      (spec 001).
- [ ] Existe al menos un test de componente (`ConfirmDialog`).
- [ ] Un error de render no controlado muestra una pantalla de
      recuperación, no una página en blanco.
- [ ] Un workflow de GitHub Actions corre en cada push/PR a la rama
      principal, ejecutando lint, test y build, y falla visiblemente si
      alguno de esos pasos falla.

## Preguntas abiertas
- ¿Se agregan tests para los hooks que dependen de Supabase (useAuth,
  useBoards, etc.)? → Fuera de alcance por ahora; requerirían mockear
  el cliente de Supabase de forma más elaborada. Se deja como
  extensión futura si se quiere profundizar en testing.