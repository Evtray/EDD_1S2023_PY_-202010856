package models

type Admin struct {
	Name     string
	Password string
	History  LinkedListHistory
}
