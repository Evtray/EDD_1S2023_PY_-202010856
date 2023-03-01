package main

import (
	"evitra/data"
	"evitra/models"
	"evitra/views"
	"fmt"
	"time"
)

var test = false

func main() {
	if test {
		fillTest()
	} else {
		sesion()
	}
}

func fillTest() {
	history := models.LinkedListHistory{}
	history.Add(models.History{Name: "Se registró en el sistema", Date: "2021-05-01 12:00:00", Id: "1"})
	history.Add(models.History{Name: "Se registró en el sistema", Date: "2021-06-01 12:00:00", Id: "2"})
	history.Add(models.History{Name: "Se registró en el sistema", Date: "2021-06-01 12:00:00", Id: "3"})
	history.Add(models.History{Name: "Se registró en el sistema", Date: "2021-06-01 12:00:00", Id: "4"})

	student := models.Student{Carnet: "20201234", Name: "Juan Perez", Password: "1234", History: history}
	student.History.DotHistory()
}

func login() {
	printLine()
	printMsg("Ingrese su usuario y contraseña")
	printLine()
	var carnet string
	var password string
	fmt.Print("Usuario: ")
	fmt.Scanln(&carnet)
	fmt.Print("Contraseña: ")
	fmt.Scanln(&password)

	var auth = false

	if carnet == data.Admin.Name && password == data.Admin.Password {
		data.UserType = 1
		auth = true
	} else {
		search := data.ListAcceptedStudents.Search(carnet, password)
		printMsg(search.Carnet + "hola")
		if search.Carnet != "" {
			data.UserType = 2
			data.Student = search
			auth = true
			now := time.Now().Format("2006-01-02 15:04:05")
			sizeHistory := search.History.Size()
			history := models.History{Name: "Se inició sesión en: ", Date: now, Id: fmt.Sprintf("%d-%s", sizeHistory+1, search.Carnet)}
			search.History.Add(history)
		}
	}

	if auth {
		if data.UserType == 1 {
			views.MenuAdmin()
		} else if data.UserType == 2 {
			views.MenuStudent()
		}
	} else {
		printLine()
		printMsg("Usuario o contraseña incorrectos")
	}
	sesion()
}

func sesion() {
	printLine()
	printMsg(data.Title)
	printMsg("1. Iniciar sesión")
	printMsg("2. Salir")
	printLine()
	fmt.Print("Ingrese una opción: ")
	var option string
	fmt.Scanln(&option)

	if option == "1" {
		login()
	}

	if option == "2" {
		printLine()
		printMsg("Gracias por usar" + data.Title)
		printLine()
	} else {
		printLine()
		printMsg("Opción no válida")
		sesion()
	}
}

func printMsg(msg string) {
	fmt.Println(msg)
}

func printLine() {
	fmt.Println("--------------------------------------------------")
}
