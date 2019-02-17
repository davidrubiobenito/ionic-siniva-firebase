export const VALIDATION_MESSAGES = {

    'email' : [
      { type: 'required', message: 'Campo email es obligatorio' },
      { type: 'pattern', message: 'Correo electrónico no válido'}, 
      { type: 'validUsed', message: 'El email ya fue registrado'}
    ],
    'password' : [
      { type: 'required', message: 'Campo contraseña es obligatorio' },
      { type: 'minlength', message: 'Constraseña debe tener al menos de 5 caracteres de longitud.' },
      { type: 'maxlength', message: 'Constraseña no puede tener mas de 10 caracteres de longitud.' },
    ]
  
  }