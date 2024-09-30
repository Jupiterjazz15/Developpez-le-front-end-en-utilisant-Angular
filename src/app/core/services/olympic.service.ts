import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from 'src/app/core/models/Olympic';
// j'importe le modèle Olympic

@Injectable({
  providedIn: 'root',
})
export class OlympicService {

  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | null>(null);
  // propriété avec un BehaviorSubject (un type d'Observable qui permet de stocker la dernière valeur émise). On utilise $ pour indique qu'il s'agit d'un observable. Cette valeur sera soit une instance d'Olympic, soit null si aucune donnée n'est disponible. On initialise cette propriété avec null.

  constructor(private http: HttpClient) {}
  //j'injecte le service HttpClient d'Angular, utilisé pour faire des requêtes HTTP

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      // utilisation du service http avec une requête GET.
      // je demande à ce que ma réponse soit sous la forme d'un tableau d'instances d'Olympic.
      // je fais mon appel vers l'URL qui est le valeur de ma propriété olympicUrl
      // on utilise l'opérateur pipe de RxJS pour transformer le flux de données.
      tap((value) => this.olympics$.next(value)),
      // tap récupère les données de la requête (value) et met à jour la valeur de l'Observable olympics$ avec cette nouvelle donnée.
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }
}
