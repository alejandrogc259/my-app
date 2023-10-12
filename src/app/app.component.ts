import {Component, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Todo } from './todo';
import {catchError, Observable, of, tap} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './../start.html',
  styleUrls: ['./../start.css']
})
export class AppComponent implements OnInit{
  title = 'my-app';
  private todosUrl = '/api/todos';  // URL to web api
  todos : Todo[] = [];
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(
    private http: HttpClient) { }
  ngOnInit(): void {
    this.getTodos2();
  }
  /** GET heroes from the server */
  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.todosUrl)
  }

  getTodos2(): void {
    this.getTodos()
      .subscribe(todos => this.todos = todos);
  }

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.todosUrl, todo, this.httpOptions).pipe(
      tap((newTodo: Todo) => console.log(`added todo w/ id=${newTodo.id}`)),
      catchError(this.handleError<Todo>('addTodo'))
    );
  }

  deleteTodo(id: number): Observable<Todo> {
    const url = `${this.todosUrl}/${id}`;

    return this.http.delete<Todo>(url, this.httpOptions).pipe(
      tap(_ => console.log(`deleted todo id=${id}`)),
      catchError(this.handleError<Todo>('deleteTodo'))
    );
  }

  add(description: string, summary: string): void {
    if (!description) { return; }
    this.addTodo({ description, summary } as Todo)
      .subscribe(todo => {
        this.todos.push(todo);
      });
  }

  delete(todo: Todo): void {
    this.todos = this.todos.filter(h => h !== todo);
    this.deleteTodo(todo.id).subscribe();
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

