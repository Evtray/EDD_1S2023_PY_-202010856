package data

import "evitra/models"

var ListStudents models.LinkedList
var ListAcceptedStudents models.LinkedList

var UserType int
var Title string = "EDD - Fase 1 - 202010856"
var Admin models.Admin = models.Admin{
	Name:     "admin",
	Password: "admin",
}

var Student models.Student = models.Student{}
