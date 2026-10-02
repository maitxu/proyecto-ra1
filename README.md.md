# Matriculator

## 1. Descripción general

**Matriculator** es una aplicación pensada para controlar el acceso de vehículos al parking de CEBANC mediante la lectura de matrículas.

El proceso comienza cuando un vehículo llega a la barrera. La cámara obtiene una imagen de la matrícula y el sistema la utiliza para identificar el vehículo, consultar sus datos y comprobar si tiene permiso para entrar.

Si la matrícula no se puede leer correctamente, la confianza de la lectura es baja o existen datos dudosos, el caso pasa a una persona de la garita para su revisión manual.

### Entrada

- Imagen de la matrícula del vehículo.
- Matrícula obtenida de la imagen.
- Datos almacenados del vehículo y del usuario.

### Procesamiento

- Captura de la imagen.
- Lectura de la matrícula.
- Comprobación de la calidad o confianza de la lectura.
- Búsqueda de la matrícula en la base de datos.
- Comprobación del permiso de acceso.
- Revisión manual cuando sea necesaria.

### Salida

El sistema puede producir tres resultados:

- **Acceso autorizado automáticamente.**
- **Acceso autorizado manualmente.**
- **Acceso denegado.**

Además, se registra la información relacionada con el acceso y, si el vehículo entra, posteriormente se registra también su salida.

---

## 2. Comparación y elección de lenguajes

Para el proyecto se estudiaron los siguientes lenguajes:

- Python
- JavaScript / Node.js
- R
- C++
- PHP
- Java

La comparación tuvo en cuenta criterios como:

- facilidad de aprendizaje;
- legibilidad;
- mantenimiento;
- integración con aplicaciones web, APIs y bases de datos;
- trabajo con datos;
- análisis estadístico;
- bibliotecas y modelos de IA;
- reutilización de modelos preentrenados;
- rendimiento y despliegue;
- interfaz web.

### Lenguaje principal seleccionado: Python

Python se seleccionó como lenguaje principal tanto para la aplicación como para el componente de Inteligencia Artificial.

Las principales razones son:

- sintaxis clara y legible;
- facilidad de desarrollo y mantenimiento;
- buen soporte para trabajar con datos;
- gran ecosistema para Inteligencia Artificial;
- disponibilidad de bibliotecas como NumPy, Pandas, Scikit-learn, PyTorch y TensorFlow;
- posibilidad de utilizar frameworks como FastAPI o Django;
- facilidad para mantener la aplicación y la IA dentro de una misma tecnología.

### JavaScript

JavaScript se utiliza como tecnología complementaria para la interactividad de la interfaz web, por ejemplo mediante `scripts.js`.

### Alternativas descartadas para IA

- **R:** está principalmente orientado a estadística y análisis de datos.
- **C++:** ofrece un rendimiento muy alto, pero aumenta la complejidad y el tiempo de desarrollo.
- **PHP:** dispone de muy pocas herramientas especializadas en machine learning y deep learning.
- **Java:** es sólido para aplicaciones empresariales, pero tiene menos agilidad y menor ecosistema de modelos preentrenados que Python.
- **JavaScript / Node.js:** es muy adecuado para web, pero tiene un ecosistema de IA más limitado que Python.

---

## 3. Funcionamiento antes de integrar la IA

Antes de integrar la Inteligencia Artificial, la lectura de la matrícula se realizaba manualmente.

El flujo era el siguiente:

1. El vehículo llega a la barrera.
2. La cámara hace una fotografía de la matrícula.
3. Se comprueba si la imagen se ve correctamente.
4. Si la imagen no es válida, se realiza una nueva fotografía.
5. Una persona de la garita lee manualmente la matrícula.
6. Se busca la matrícula en la base de datos.
7. Se comprueba si el vehículo tiene permiso.
8. Si tiene permiso, se abre la barrera.
9. Si no tiene permiso, la barrera permanece cerrada.
10. Se registra el resultado.

Este funcionamiento requiere intervención humana para leer todas las matrículas.

---

## 4. Funcionamiento después de integrar la IA

Con la IA integrada, la lectura de la matrícula se automatiza.

El flujo general es:

1. **Llegada del vehículo**  
   El sistema detecta que hay un vehículo esperando en la barrera.

2. **Foto de la matrícula**  
   La cámara obtiene una imagen y la envía al sistema.

3. **Lectura de la matrícula con IA**  
   La IA localiza la matrícula, intenta leer sus caracteres y genera un nivel de confianza.

4. **Comprobación de la lectura**  
   Si la matrícula se ha leído correctamente y con suficiente confianza, el proceso continúa.  
   Si no, el caso pasa a revisión manual.

5. **Búsqueda en la base de datos**  
   Se consulta la matrícula para conocer el vehículo, el usuario y sus permisos.

6. **Comprobación del permiso**  
   - Si el vehículo tiene permiso o pertenece a un usuario autorizado, se permite la entrada.
   - Si está registrado pero no tiene permiso, se deniega el acceso.
   - Si no está registrado o existen datos dudosos, el caso pasa a revisión manual.

7. **Revisión en la garita**  
   Una persona revisa los casos que el sistema no puede resolver y decide si permite o no la entrada.

8. **Registro del resultado**  
   El sistema guarda la fotografía, la matrícula, la fecha, la hora y el resultado.

9. **Fin del proceso**  
   Se muestra el resultado final. Si el vehículo entra, más adelante se registra también su fecha y hora de salida.

---

## 5. Revisión humana

La revisión humana sigue siendo necesaria en los casos en los que el sistema no puede tomar una decisión fiable.

Por ejemplo:

- la matrícula no se lee correctamente;
- la confianza de la IA es baja;
- el vehículo no aparece en la base de datos;
- faltan datos;
- existen datos dudosos.

En estos casos, una persona de la garita comprueba la información y decide si permite o no el acceso.

---

## 6. Pseudocódigo y partes principales del programa

El pseudocódigo del proyecto se divide en cuatro partes principales.

### 6.1 Obtener la matrícula

La cámara realiza una fotografía del vehículo.

- Si no se consigue obtener la imagen, el sistema muestra un error.
- Si hay imagen, la IA intenta leer la matrícula.
- Si la lectura no es fiable, el caso pasa a revisión manual.
- Si la lectura es correcta, el proceso continúa.

### 6.2 Comprobar si puede entrar

El sistema busca la matrícula en la base de datos.

- Si hay un problema, faltan datos o el vehículo no aparece, se solicita revisión manual.
- Si el vehículo es de un docente o tiene permiso, se autoriza el acceso.
- Si está registrado pero no tiene permiso, se deniega la entrada.

### 6.3 Abrir o cerrar la barrera

- Si el acceso está autorizado, la barrera se abre y se registra la fecha y hora de entrada.
- Si el acceso está denegado, la barrera permanece cerrada.
- En ambos casos se guarda el resultado del intento de acceso.

### 6.4 Registrar la salida

Cuando el vehículo abandona el parking, el sistema busca su entrada registrada.

- Si existe, se guarda la fecha y hora de salida.
- Si no existe ninguna entrada pendiente, se muestra un mensaje de error.

---

## 7. Diagramas incluidos

El proyecto incluye dos diagramas de flujo:

### Diagrama PRE-IA

`Diagrama_flujos_PRE_IA_PASO 3.png`

Representa el funcionamiento antes de integrar el modelo de Inteligencia Artificial, cuando la matrícula debía ser leída manualmente por una persona.

### Diagrama POST-IA

`Diagrama_flujos_POST_IA_PASO 3.png`

Representa el funcionamiento con la IA integrada, incluyendo:

- lectura automática de la matrícula;
- nivel de confianza;
- consulta de la base de datos;
- comprobación de permisos;
- revisión humana;
- apertura o cierre de la barrera;
- registro del resultado.

---
