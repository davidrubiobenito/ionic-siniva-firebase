export const VALIDATION_MESSAGES = {

    'email' : [
      { type: 'required', message: 'Campo email es obligatorio' },
      { type: 'pattern', message: 'Correo electrónico no válido'}, 
      { type: 'validUsed', message: 'El email ya fue registrado'}
    ],
    'password' : [
      { type: 'required', message: 'Campo contraseña es obligatorio' },
      { type: 'minlength', message: 'Contraseña debe tener al menos de 5 caracteres de longitud.' },
      { type: 'maxlength', message: 'Contraseña no puede tener mas de 10 caracteres de longitud.' }
    ],
    'confirmpassword' : [
      { type: 'required', message: 'Campo contraseña es obligatorio' },
      { type: 'minlength', message: 'Contraseña debe tener al menos de 5 caracteres de longitud.' },
      { type: 'maxlength', message: 'Contraseña no puede tener mas de 10 caracteres de longitud.' }
    ],
    'nameproduct' : [
      { type: 'required', message: 'Campo nombre es obligatorio' }
    ],
    'units' : [
      { type: 'required', message: 'Campo unidades es obligatorio' },
      { type: 'pattern', message: 'Formato unidades no válido'}, 
      { type: 'min', message: 'Valor mínimo debe ser 0' }      
    ],
    'price' : [
      { type: 'required', message: 'Campo precio es obligatorio' },
      { type: 'pattern', message: 'Formato precio no válido'}, 
      { type: 'min', message: 'Valor mínimo debe ser 0' }      
    ],
    'tax' : [
      { type: 'required', message: 'Campo impuesto es obligatorio' },
      { type: 'pattern', message: 'Formato impuesto no válido'}, 
      { type: 'min', message: 'Valor mínimo debe ser 0' },
      { type: 'max', message: 'Valor máximo debe ser 100' } 
    ]
  
  }