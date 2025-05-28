export function areObjectsDeepEqual(obj1, obj2) {
  // 1. Comprobar si son el mismo objeto o si ambos son null/undefined
  if (obj1 === obj2) {
    return true;
  }

  // 2. Si uno es null/undefined y el otro no, no son iguales
  if (
    obj1 === null ||
    typeof obj1 !== "object" ||
    obj2 === null ||
    typeof obj2 !== "object"
  ) {
    return false;
  }

  // 3. Obtener las claves de ambos objetos
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // 4. Comprobar si tienen la misma cantidad de claves
  if (keys1.length !== keys2.length) {
    return false;
  }

  // 5. Iterar sobre las claves y comparar los valores recursivamente
  for (const key of keys1) {
    // Si la clave no existe en el segundo objeto, no son iguales
    if (!keys2.includes(key)) {
      return false;
    }

    // Si el valor es un objeto, llamar a la función recursivamente
    if (typeof obj1[key] === "object" && obj1[key] !== null) {
      if (!areObjectsDeepEqual(obj1[key], obj2[key])) {
        return false;
      }
    } else {
      // Si no es un objeto, comparar los valores directamente
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
  }

  // Si todas las comparaciones pasaron, los objetos son iguales
  return true;
}
