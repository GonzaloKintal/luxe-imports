import User from '../models/User.js';
import bcrypt from 'bcryptjs';

class UserManager {
  // Obtiene todos los usuarios
  async getUsers() {
    return await User.find();
  }

  // Busca usuario por ID
  async getUserById(id) {
    return await User.findById(id);
  }

  // Busca usuario por email
  async getUserByEmail(email) {
    return await User.findOne({ email });
  }

  // Agrega usuario nuevo
  async addUser(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("El email ya está registrado. Si olvidaste tu contraseña, podés usar la opción 'Olvidé mi contraseña'");
    }
	  const newUser = new User({
	    ...userData,
	    role: userData.role || 'user',
	  });
    await newUser.save();
    const { password, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  }

  // Valida usuario por email y password
  async validateUser(email, plainPassword) {
    const user = await User.findOne({ email });
    if (!user) return null;
    const passwordMatch = await bcrypt.compare(plainPassword, user.password);
    return passwordMatch ? user : null;
  }


	async updateUserPassword(email, hashedPassword) {
	  const user = await User.findOne({ email });
	  if (!user) throw new Error("Usuario no encontrado");
	  user.password = hashedPassword;
	  await user.save();
	  const { password, ...userWithoutPassword } = user.toObject();
	  return userWithoutPassword;
	}


}

const userManager = new UserManager();
export default userManager;