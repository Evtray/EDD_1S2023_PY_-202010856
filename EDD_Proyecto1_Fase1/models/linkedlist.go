package models

import (
	"encoding/json"
	"fmt"
	"os"
	"time"
)

type Node struct {
	Student Student
	Next    *Node
}

type LinkedList struct {
	Head *Node
	Tail *Node
}

func (l *LinkedList) Add(student Student) {
	newNode := &Node{Student: student}
	if l.Head == nil {
		l.Head = newNode
		l.Tail = newNode
	} else {
		l.Tail.Next = newNode
		l.Tail = newNode
	}
}

func (l *LinkedList) Get(index int) Student {
	if index == 0 {
		return l.Head.Student
	} else {
		current := l.Head
		for i := 0; i < index; i++ {
			current = current.Next
		}
		return current.Student
	}
}

func (l *LinkedList) Delete(index int) {
	if index == 0 {
		l.Head = l.Head.Next
	} else {
		current := l.Head
		for i := 0; i < index-1; i++ {
			current = current.Next
		}
		current.Next = current.Next.Next
	}
}

// buscar estudiante por carnet y password
func (l *LinkedList) Search(carnet string, password string) Student {
	current := l.Head
	for current != nil {
		if current.Student.Carnet == carnet && current.Student.Password == password {
			return current.Student
		}
		current = current.Next
	}
	return Student{}
}

// buscar estudiante por carnet
func (l *LinkedList) SearchStudentByCarnet(carnet string) Student {
	current := l.Head
	for current != nil {
		if current.Student.Carnet == carnet {
			return current.Student
		}
		current = current.Next
	}
	return Student{}
}

// get size of list
func (l *LinkedList) Size() int {
	current := l.Head
	size := 0
	for current != nil {
		size++
		current = current.Next
	}
	return size
}

// show students
func (l *LinkedList) ShowStudents() {
	current := l.Head
	for current != nil {
		printLine()
		printMsg("Carnet: " + current.Student.Carnet)
		printMsg("Nombre: " + current.Student.Name)
		printMsg("Contraseña: " + current.Student.Password)
		current = current.Next
		time.Sleep(time.Second)
	}
}

func (l *LinkedList) ShowStudentsByStep() LinkedList {

	list := LinkedList{}

	current := l.Head
	for current != nil {
		printLine()
		size := l.Size()
		printMsg(fmt.Sprintf("Estudiante %d de %d", size, size))
		printLine()
		printMsg("Carnet: " + current.Student.Carnet)
		printMsg("Nombre: " + current.Student.Name)
		printMsg("Contraseña: " + current.Student.Password)
		printLine()
		var option int
		fmt.Print("1. Aceptar\n2. Rechazar\n3. Siguiente\n4. Salir\nOpción: ")
		fmt.Scanln(&option)
		switch option {
		case 1:
			list.Add(current.Student)
			l.Delete(0)
		case 2:
			l.Delete(0)
		case 3:
			printMsg("Siguiente estudiante")
		case 4:
			return list
		default:
			printLine()
			printMsg("Opción no válida")
		}
		current = current.Next
	}
	return list
}

func (l *LinkedList) ReportJSON() {
	var students []StudentExport

	current := l.Head
	for current != nil {
		students = append(students, StudentExport{current.Student.Carnet, current.Student.Name, current.Student.Password})
		current = current.Next
	}

	file, err := os.Create("students.json")
	if err != nil {
		fmt.Println("Error al abrir el archivo:", err)
		return
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(students); err != nil {
		fmt.Println("Error al escribir en el archivo:", err)
	}

	printLine()
	printMsg("Reporte generado con éxito")
}

func printMsg(msg string) {
	fmt.Println(msg)
}

func printLine() {
	fmt.Println("--------------------------------------------------")
}

func (l *LinkedList) SortByCarnet() {
	head := l.Head
	if head == nil {
		return
	}
	var swapped bool
	for {
		current := head
		swapped = false
		for current.Next != nil {
			if current.Student.Carnet > current.Next.Student.Carnet {
				current.Student, current.Next.Student = current.Next.Student, current.Student
				swapped = true
			}
			current = current.Next
		}
		if !swapped {
			break
		}
	}
}
func (l *LinkedList) DotSimple() {
	head := l.Head
	if head == nil {
		fmt.Println("Cola vacía")
		return
	}
	// Creamos un archivo para guardar el código Graphviz
	f, err := os.Create("reportecola.dot")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer f.Close()

	// Escribimos el encabezado del archivo
	_, err = fmt.Fprintf(f, "digraph {\nrankdir=LR;\nnode [style=filled];\n")

	// Recorremos la lista enlazada y agregamos cada nodo al grafo
	current := head
	for current != nil {
		_, err = fmt.Fprintf(f, "  %s [label=\"%s\\n%s\" shape=box];\n", current.Student.Carnet, current.Student.Carnet, current.Student.Name)
		current = current.Next
	}

	// Recorremos la lista enlazada de nuevo para agregar las conexiones entre nodos
	current = head
	for current != nil {
		if current.Next != nil {
			_, err = fmt.Fprintf(f, "  %s -> %s;\n", current.Student.Carnet, current.Next.Student.Carnet)
		}
		current = current.Next
	}

	// Escribimos el cierre del archivo
	_, err = fmt.Fprintf(f, "}\n")
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println("Graphviz generado en reportecola.dot")
}

func (l *LinkedList) Dot() {
	head := l.Head
	if head == nil {
		return
	}
	// Creamos un archivo para guardar el código Graphviz
	f, err := os.Create("reportelistaenlazada.dot")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer f.Close()

	// Escribimos el encabezado del archivo
	_, err = fmt.Fprintf(f, "digraph {\nrankdir=LR;\nnode [style=filled];\n")
	_, err = fmt.Fprintf(f, "  %s [label=\"%s\\n%s\" shape=box];\n", "null1", "Null", "")
	_, err = fmt.Fprintf(f, "  %s [label=\"%s\\n%s\" shape=box];\n", "null2", "Null", "")

	// Recorremos la lista enlazada y agregamos cada nodo al grafo
	current := head
	for current != nil {
		_, err = fmt.Fprintf(f, "  %s [label=\"%s\\n%s\" shape=box];\n", current.Student.Carnet, current.Student.Carnet, current.Student.Name)
		// reccorer history del estudiante y agregarlo al grafo
		current2 := current.Student.History.Head
		for current2 != nil {
			_, err = fmt.Fprintf(f, "  %s [label=\"%s\\n%s\" shape=box];\n", current2.History.Id, current2.History.Name, current2.History.Date)
			current2 = current2.Next
		}

		current = current.Next
	}

	// Recorremos la lista enlazada de nuevo para agregar las conexiones entre nodos
	index := 0
	current = head
	for current != nil {
		if index == 0 {
			_, err = fmt.Fprintf(f, "  %s -> %s;\n", "null1", current.Student.Carnet)
			_, err = fmt.Fprintf(f, "  %s -> %s;\n", current.Student.Carnet, "null1")
		}
		current2 := current.Student.History.Head
		for current2 != nil {
			_, err = fmt.Fprintf(f, "  %s -> %s;\n", current2.History.Id, current.Student.Carnet)
			current2 = current2.Next
		}
		if current.Next != nil {
			_, err = fmt.Fprintf(f, "  %s -> %s;\n", current.Student.Carnet, current.Next.Student.Carnet)
			_, err = fmt.Fprintf(f, "  %s -> %s;\n", current.Next.Student.Carnet, current.Student.Carnet)
		} else {
			_, err = fmt.Fprintf(f, "  %s -> %s;\n", current.Student.Carnet, "null2")
			_, err = fmt.Fprintf(f, "  %s -> %s;\n", "null2", current.Student.Carnet)
		}
		index++
		current = current.Next
	}

	// Escribimos el cierre del archivo
	_, err = fmt.Fprintf(f, "}\n")
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println("Graphviz generado en reportelistaenlazada.dot")
}
