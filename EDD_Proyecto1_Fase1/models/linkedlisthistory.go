package models

import (
	"fmt"
	"os"
	"time"
)

type NodeHistory struct {
	History History
	Next    *NodeHistory
}

type LinkedListHistory struct {
	Head *NodeHistory
	Tail *NodeHistory
}

func (l *LinkedListHistory) Add(history History) {
	node := &NodeHistory{History: history}
	if l.Head == nil {
		l.Head = node
		l.Tail = node
	} else {
		node.Next = l.Head
		l.Head = node
	}
}

func (l *LinkedListHistory) Get(index int) History {
	if index == 0 {
		return l.Head.History
	} else {
		current := l.Head
		for i := 0; i < index; i++ {
			current = current.Next
		}
		return current.History
	}
}

func (l *LinkedListHistory) Print() {
	current := l.Head
	for current != nil {
		printLine()
		fmt.Println(current.History.Name + " " + current.History.Date)
		current = current.Next
		time.Sleep(1 * time.Second)
	}
}

func (l *LinkedListHistory) Size() int {
	current := l.Head
	size := 0
	for current != nil {
		size++
		current = current.Next
	}
	return size
}

func (l *LinkedListHistory) DotHistory() {
	file, err := os.Create("history.dot")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer file.Close()
	file.WriteString("digraph G {\n")
	file.WriteString("rankdir=LR;\n")
	file.WriteString("node [shape=record];\n")
	current := l.Head
	for current != nil {
		file.WriteString("node" + current.History.Id + " [label=\"" + current.History.Name + " " + current.History.Date + "\"];\n")
		current = current.Next
	}
	current = l.Head
	for current != nil {
		if current.Next != nil {
			file.WriteString("node" + current.History.Id + " -> node" + current.Next.History.Id + ";\n")
		}
		current = current.Next
	}
	file.WriteString("}")

	fmt.Println("Graphviz generado en history.dot")
}
