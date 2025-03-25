const {createClient} = require('@supabase/supabase-js')
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const authMiddleware = async (req, res , next ) =>{
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token){
        return res.status(401).json({ error: 'No token provided' });
    }
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
    
      req.user = user; // Attach user to request
      next();
      

}

module.exports = authMiddleware;