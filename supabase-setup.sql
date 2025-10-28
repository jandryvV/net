-- ProjectHub Database Setup for Supabase
-- Ejecuta estos scripts en tu proyecto de Supabase en el orden dado

-- 1. Crear tabla de perfiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- 2. Crear tabla de proyectos
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold')),
  tags TEXT[] DEFAULT '{}',
  team_members TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0
);

-- 3. Crear tabla de likes
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(project_id, user_id)
);

-- 4. Crear tabla de comentarios
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Crear tabla de notificaciones
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'project_invite', 'project_update')),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Funciones para incrementar/decrementar likes
CREATE OR REPLACE FUNCTION increment_likes(project_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE projects SET likes_count = likes_count + 1 WHERE id = project_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_likes(project_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE projects SET likes_count = likes_count - 1 WHERE id = project_id;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger para actualizar updated_at en projects
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 9. Habilitar Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 10. Políticas de seguridad para profiles
CREATE POLICY "Usuarios pueden ver todos los perfiles" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden insertar su propio perfil" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 11. Políticas de seguridad para projects
CREATE POLICY "Todos pueden ver proyectos" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Usuarios pueden crear proyectos" ON projects
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Usuarios pueden actualizar sus proyectos" ON projects
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Usuarios pueden eliminar sus proyectos" ON projects
    FOR DELETE USING (auth.uid() = created_by);

-- 12. Políticas de seguridad para likes
CREATE POLICY "Todos pueden ver likes" ON likes
    FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden dar like" ON likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden quitar sus likes" ON likes
    FOR DELETE USING (auth.uid() = user_id);

-- 13. Políticas de seguridad para comments
CREATE POLICY "Todos pueden ver comentarios" ON comments
    FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden comentar" ON comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus comentarios" ON comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus comentarios" ON comments
    FOR DELETE USING (auth.uid() = user_id);

-- 14. Políticas de seguridad para notifications
CREATE POLICY "Usuarios pueden ver sus notificaciones" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus notificaciones" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Sistema puede crear notificaciones" ON notifications
    FOR INSERT WITH CHECK (true);

-- 15. Índices para mejorar performance
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_likes_project_id ON likes(project_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_comments_project_id ON comments(project_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- 16. Datos de ejemplo (opcional - ejecutar solo en desarrollo)
-- INSERT INTO profiles (id, email, full_name, bio) VALUES 
-- (gen_random_uuid(), 'demo@example.com', 'Usuario Demo', 'Desarrollador apasionado por la tecnología');

-- INSERT INTO projects (title, description, created_by, status, tags) VALUES 
-- ('Sistema de Gestión', 'Un sistema completo para gestión empresarial', 
--  (SELECT id FROM profiles WHERE email = 'demo@example.com'), 
--  'in_progress', ARRAY['vue', 'typescript', 'supabase']);

COMMENT ON TABLE profiles IS 'Perfiles de usuarios extendidos desde auth.users';
COMMENT ON TABLE projects IS 'Proyectos compartidos por los usuarios';
COMMENT ON TABLE likes IS 'Likes/reacciones a proyectos';
COMMENT ON TABLE comments IS 'Comentarios en proyectos';
COMMENT ON TABLE notifications IS 'Notificaciones para usuarios';