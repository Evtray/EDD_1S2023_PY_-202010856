package models

type Student struct {
	Carnet   string
	Name     string
	Password string
	History  LinkedListHistory
}

type StudentExport struct {
	Carnet   string
	Name     string
	Password string
}
