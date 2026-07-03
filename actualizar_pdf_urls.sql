-- ============================================================
-- CORREGIR URLs de PDF en videos_biblioteca
-- Ejecutar en: Supabase > SQL Editor
-- ============================================================

-- OSTEOLOGÍA
UPDATE public.videos_biblioteca SET pdf_resumen_url = 'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/osteologia/Tema%201%20Osea%20de%20Cabeza%20y%20Cuello.pdf'
  WHERE categoria = 'osteologia' AND orden = 1;

UPDATE public.videos_biblioteca SET pdf_resumen_url = 'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/osteologia/Tema%202%20Huesos%20del%20Craneo%20Odontologia.pdf'
  WHERE categoria = 'osteologia' AND orden = 2;

UPDATE public.videos_biblioteca SET pdf_resumen_url = 'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/osteologia/Tema%203%20Huesos%20de%20la%20Cara.pdf'
  WHERE categoria = 'osteologia' AND orden = 3;

UPDATE public.videos_biblioteca SET pdf_resumen_url = 'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/osteologia/Tema%204.%20Cavidades%20Craneales.pdf'
  WHERE categoria = 'osteologia' AND orden = 4;

UPDATE public.videos_biblioteca SET pdf_resumen_url = 'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/osteologia/Tema%205%20ATM.pdf'
  WHERE categoria = 'osteologia' AND orden = 5;

UPDATE public.videos_biblioteca SET pdf_resumen_url = 'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/osteologia/Tema%206%20BASE%20DEL%20CRANEO.pdf'
  WHERE categoria = 'osteologia' AND orden = 6;

-- MIOLOGÍA
UPDATE public.videos_biblioteca SET pdf_resumen_url = 'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/miologia/TEMA%201.%20Miologia_Cabeza_Cuello.pdf'
  WHERE categoria = 'miologia' AND orden = 1;

UPDATE public.videos_biblioteca SET pdf_resumen_url = 'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/miologia/TEMA%202.%20MUSCULOS%20DE%20MASTICACION.pdf'
  WHERE categoria = 'miologia' AND orden = 2;

UPDATE public.videos_biblioteca SET pdf_resumen_url = 'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/miologia/TEMA%203.Musculos_Expresion_Facial.pdf'
  WHERE categoria = 'miologia' AND orden = 3;

UPDATE public.videos_biblioteca SET pdf_resumen_url = 'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/miologia/TEMA%204.Miologia_Musculos_Cuello.pdf'
  WHERE categoria = 'miologia' AND orden = 4;

UPDATE public.videos_biblioteca SET pdf_resumen_url = 'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/miologia/TEMA%205.Irrigacion_Muscular_Basica.pdf'
  WHERE categoria = 'miologia' AND orden = 5;

UPDATE public.videos_biblioteca SET pdf_resumen_url = 'https://jrpfhotugcwhpndfwjrw.supabase.co/storage/v1/object/public/resumenes-pdf/miologia/TEMA%206.Movimiento_Mandibular_Rouviere.pdf'
  WHERE categoria = 'miologia' AND orden = 6;

-- VERIFICACIÓN
SELECT categoria, orden, tema,
       CASE WHEN pdf_resumen_url IS NOT NULL THEN '✓' ELSE '✗' END AS tiene_pdf
FROM public.videos_biblioteca
WHERE categoria IN ('osteologia','miologia')
ORDER BY categoria, orden;
