# Manual Técnico - Fase 3

Universidad de San Carlos de Guatemala
Facultad de Ingeniería
Escuela de Ciencias y Sistemas
Estructuras de Datos
|Nombre|Carnet |
|--|--|
|Edwin Sandoval López | 202010856 |

# Objetivos

_General_
GoDrive es una aplicación web diseñada para almacenar pequeños archivos de forma segura y fácil. Con GoDrive, los usuarios pueden cargar y acceder a sus archivos desde cualquier lugar con conexión a Internet.

# INFORMACIÓN DEL SISTEMA

La aplicación web GoDrive es la solución ideal para aquellos que buscan almacenar archivos pequeños de manera segura y sencilla. Con la capacidad de cargar y acceder a los archivos desde cualquier lugar con conexión a Internet, los usuarios pueden estar seguros de que sus datos están siempre disponibles.

GoDrive es una herramienta fácil de usar que ofrece una forma confiable de almacenamiento en línea para aquellos que buscan una opción simple pero efectiva para el almacenamiento de archivos.

# FUNCIONES DEL SISTEMA

- Iniciar Sesión:
  Al ingresar a dicha opción del Menú, le permitirá al usuario ingresar al sistema mediante un usuario y contraseña.
- Crear carpeta:

-Clase NodoMatrizAdyacencia:

-constructor(nombre, tipo):
crea un nuevo nodo para el grafo con un nombre y un tipo. Cada nodo tiene una matriz, un puntero a su siguiente nodo hermano y un puntero a su siguiente nodo hijo.

-Clase Grafo Dirigido:

- constructor():
  crea un nuevo gráfico dirigido con un nodo raíz llamado /.

- AgregarHijo(inicio, nuevoNodo):
  agrega un nodo hijo nuevoNodo al final de la lista de hermanos de inicio.
- InsertarColumna(ruta, padre, nombre):
  inserta una nueva columna con un nodo llamado nombre en la lista de hermanos de padre en la fila especificada por ruta.

- InsertarFila(nodoPadre):
  inserta una nueva fila con el nodo nodoPadre al final del gráfico.

- BuscarRuta(nombreBuscado):
  devuelve la ruta del nodo con el nombreBuscado dado desde el nodo raíz / como una cadena.

- BuscarRutaV2(ruta, opc):
  encuentra el nodo especificado por ruta y devuelve el objeto nodo o un valor booleano dependiendo del valor de opc. También crea una nueva fila con el mismo nombre que el último nodo en la ruta si opc es 2.

- InsertarValores(ruta, hijo):
  inserta un nuevo nodo con el nombre hijo en la lista de hermanos del último nodo en la ruta especificada por ruta.

- PadreReptido(nombre):
  comprueba si existe un nodo con el nombre nombre en las filas del gráfico y devuelve un valor booleano.

- VerPadres():
  imprime los nombres de todos los nodos padres en el gráfico.

- BuscarPadre(ruta): devuelve el objeto nodo padre del último nodo en la ruta especificada por ruta.

- BlockChain:
  La clase nodoBloque representa un nodo de bloque y tiene un constructor que inicializa sus propiedades.
  La clase Bloque representa la lista enlazada de bloques y tiene un constructor que inicializa la propiedad inicio a nulo y la propiedad bloques_creados a 0.

- InsertarBloque:
  Se utiliza para insertar un nuevo bloque en la lista enlazada. El método toma la fecha, el emisor, el receptor y el mensaje como entrada y crea un nuevo nodo de bloque utilizando el constructor nodoBloque. Si la propiedad de inicio es nula, el nuevo nodo se establece como el comienzo de la lista vinculada; de lo contrario, el nuevo nodo se agrega al final de la lista.

- MostrarBloques:
  se utiliza para mostrar los mensajes en la ventana de chat. Toma el carné y el receptor como entrada e itera sobre la lista enlazada para encontrar los mensajes enviados entre el carné y el receptor.

- BuscarBloques:
  se utiliza para mostrar la lista de usuarios que han intercambiado mensajes con el usuario cuyo carné se da como entrada. Recorre la lista vinculada para encontrar a los usuarios que han intercambiado mensajes con el usuario actual y muestra sus nombres en una lista.
