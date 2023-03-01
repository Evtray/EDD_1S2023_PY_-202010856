package views

import (
	"evitra/data"
	"fmt"
)

func MenuStudent() {
	for {
		printLine()
		printMsg("Menú de estudiante")
		printLine()
		printMsg("1. Ver historial")
		printMsg("2. Ver datos")
		printMsg("3. Cerrar sesión")
		printLine()
		var option int
		fmt.Print("Ingrese una opción: ")
		fmt.Scanln(&option)

		switch option {
		case 1:
			data.Student.History.Print()
		case 2:
			printLine()
			printMsg("Carnet: " + data.Student.Carnet)
			printMsg("Nombre: " + data.Student.Name)
			printMsg("Contraseña: " + data.Student.Password)

			fmt.Print("Presione cualquier tecla para continuar...")
			fmt.Scanln()
		case 3:
			return
		default:
			printLine()
			printMsg("Opción incorrecta")
		}
	}
}
