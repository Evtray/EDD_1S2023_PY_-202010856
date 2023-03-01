package views

import (
	"encoding/csv"
	"evitra/data"
	"evitra/models"
	"fmt"
	"os"
	"time"
)

func MenuAdmin() {
	for {
		printLine()
		printMsg("Menú de administrador")
		printMsg("1. Ver estudiantes pendientes")
		printMsg("2. Ver estudiantes del sistema")
		printMsg("3. Registrar Nuevo Estudiante")
		printMsg("4. Carga Masiva de Estudiantes")
		printMsg("5. Reportes")
		printMsg("6. Cerrar Sesión")
		printLine()
		fmt.Print("Ingrese una opción: ")
		var option int
		fmt.Scanln(&option)
		switch option {
		case 1:
			showPendingStudents()
		case 2:
			printLine()
			printMsg("Estudiantes del sistema")
			data.ListAcceptedStudents.SortByCarnet()
			data.ListAcceptedStudents.ShowStudents()
			fmt.Print("Presione cualquier tecla para continuar...")
			fmt.Scanln()
		case 3:
			addStudent()
		case 4:
			addStudentsByFile()
		case 5:
			reports()
		case 6:
			return
		default:
			printLine()
			printMsg("Opción no válida")
		}
	}
}
func showPendingStudents() {
	printLine()
	printMsg("Estudiantes pendientes")
	if data.ListStudents.Size() == 0 {
		printLine()
		printMsg("No hay estudiantes pendientes")
		return
	} else {
		printLine()
		listStudents := data.ListStudents.ShowStudentsByStep()

		if listStudents.Size() > 0 {
			current := listStudents.Head
			for current != nil {
				now := time.Now().Format("2006-01-02 15:04:05")
				data.Admin.History.Add(models.History{Name: "Se aceptó al estudiante " + current.Student.Name + " con carnet " + current.Student.Carnet, Date: now})
				data.ListAcceptedStudents.Add(current.Student)
				current = current.Next
			}
		}
	}

}

func addStudent() {
	printLine()
	printMsg("Registrar estudiante")
	var carnet string
	var name string
	var password string
	printLine()
	fmt.Print("Carnet: ")
	fmt.Scanln(&carnet)
	fmt.Print("Nombre: ")
	fmt.Scanln(&name)
	fmt.Print("Contraseña: ")
	fmt.Scanln(&password)

	if carnet == "" || name == "" || password == "" {
		printLine()
		printMsg("Los campos no pueden estar vacios")
		return
	}

	search := data.ListStudents.SearchStudentByCarnet(carnet)

	if search.Carnet != "" {
		printLine()
		printMsg("El carnet ya existe")
		return
	} else {
		data.ListStudents.Add(models.Student{Carnet: carnet, Name: name, Password: password})
		printLine()
		printMsg("Estudiante registrado")
	}

}

func addStudentsByFile() {
	printLine()
	printMsg("Carga masiva de estudiantes")
	var path string
	fmt.Print("Ingrese la ruta del archivo: ")
	fmt.Scanln(&path)

	readCSV(path)
	printLine()
}

func readCSV(path string) {
	csvFile, err := os.Open(path)
	if err != nil {
		fmt.Println(err)
	}
	defer csvFile.Close()

	reader := csv.NewReader(csvFile)

	reader.FieldsPerRecord = -1

	csvData, err := reader.ReadAll()
	if err != nil {
		fmt.Println(err)
		return
	}

	for _, each := range csvData {
		carnet := each[0]
		name := each[1]
		password := each[2]

		data.ListStudents.Add(models.Student{Carnet: carnet, Name: name, Password: password})
	}

	printMsg("Estudiantes agregados")
}

func reports() {
	printLine()
	printMsg("Reportes")
	printMsg("1. Reporte de la lista enlazada doble")
	printMsg("2. Reporte de la cola")
	printMsg("3. Reporte de la Pila del Administrador")
	printMsg("4. Reporte JSON")
	printMsg("5. Regresar")

	var option int
	fmt.Print("Ingrese una opción: ")
	fmt.Scanln(&option)

	switch option {
	case 1:
		data.ListAcceptedStudents.SortByCarnet()
		data.ListAcceptedStudents.Dot()
	case 2:
		data.ListStudents.DotSimple()
	case 3:
		data.Admin.History.DotHistory()
	case 4:
		data.ListAcceptedStudents.ReportJSON()
	case 5:
		return
	default:
		printLine()
		printMsg("Opción no válida")
	}
}

func printMsg(msg string) {
	fmt.Println(msg)
}

func printLine() {
	fmt.Println("--------------------------------------------------")
}
