-- Actualizar todos los videos que usan .mp4 a un enlace genérico de YouTube
UPDATE public.multimedia
SET url = 'https://www.youtube.com/watch?v=kYx4u-bV_eU'
WHERE tipo = 'video' AND url LIKE '%.mp4%';
