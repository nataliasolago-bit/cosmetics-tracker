# Exportación de la base de datos REAL para CANVAS

`schema.sql` crea una base vacía; `seed_demo.sql` carga datos ficticios. Ninguno sustituye la exportación real exigida.

En **SQL Server Management Studio**:
1. Conéctate a la instancia que contiene `cosmetics_tracker`.
2. Haz clic derecho en la base: **Tasks → Generate Scripts**.
3. Selecciona **Script entire database and all database objects**.
4. En **Advanced → Types of data to script**, elige **Schema and data**.
5. Guarda `cosmetics_tracker_export.sql` y comprueba su restauración en una base aislada.

Alternativamente, si el docente acepta respaldos binarios, **Tasks → Back Up → Full** para generar un archivo `.bak`.

**Privacidad:** el export puede contener correos, nombres, hashes de contraseñas y otros datos personales. Anonimiza datos cuando corresponda; no publiques respaldos privados en un repositorio público. No incluyas `.env` ni credenciales.
