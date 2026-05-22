-- Si vous rencontrer l'erreur ORA-06598, entrer cette commande
-- GRANT INHERIT PRIVILEGES ON USER SYS TO ORDS_METADATA;

BEGIN
  ORDS.ENABLE_SCHEMA(
    p_enabled => TRUE,
    p_schema => 'SITETP3', -- Nom de votre schéma
    p_url_mapping_type => 'BASE_PATH',
    p_url_mapping_pattern => 'sitetp3', -- Préfixe dans l'URL
    p_auto_rest_auth => FALSE
  );
  COMMIT;
END;
/

BEGIN
  ORDS.ENABLE_OBJECT(
    p_enabled => TRUE,
    p_schema => 'SITETP3',
    p_object => 'FABRICANT',
    p_auto_rest_auth => FALSE
  );
  COMMIT;
END;
/

BEGIN
  ORDS.ENABLE_OBJECT(
    p_enabled => TRUE,
    p_schema => 'SITETP3',
    p_object => 'CONSOLE',
    p_object_type => 'TABLE',
    p_auto_rest_auth => FALSE
  );
  COMMIT;
END;
/

BEGIN
  ORDS.ENABLE_OBJECT(
    p_enabled => TRUE,
    p_schema => 'SITETP3',
    p_object => 'GENRE',
    p_object_type => 'TABLE',
    p_auto_rest_auth => FALSE
  );
  COMMIT;
END;
/

BEGIN
  ORDS.ENABLE_OBJECT(
    p_enabled => TRUE,
    p_schema => 'SITETP3',
    p_object => 'JEU',
    p_object_type => 'TABLE',
    p_auto_rest_auth => FALSE
  );
  COMMIT;
END;
/

BEGIN
  ORDS.ENABLE_OBJECT(
    p_enabled => TRUE,
    p_schema => 'SITETP3',
    p_object => 'EXEMPLAIRE',
    p_object_type => 'TABLE',
    p_auto_rest_auth => FALSE
  );
  COMMIT;
END;
/