import { Component, OnInit } from '@angular/core';
import { LessonService } from 'src/app/Service/lesson.service';
import { UserService } from 'src/app/Service/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  statCards = [
    {
      label: 'Utilisateurs',
      value: '0',
      growth: 0,
      icon: 'fas fa-users',
      bgColor: '#c8c9fa'
    },
    {
      label: 'Formateurs',
      value: '0',
      growth: 0,
      icon: 'fas fa-user-tie',
      bgColor: '#fddede'
    },
    {
      label: 'Leçons',
      value: '0',
      growth: 0,
      icon: 'fas fa-chalkboard-teacher',
      bgColor: '#c7e3fb'
    },
  ];

  userGrowth = [
    { month: 'Jan', value: 0 },
    { month: 'Feb', value: 0 },
    { month: 'Mar', value: 0 },
    { month: 'Apr', value: 0 },
    { month: 'May', value: 0 },
    { month: 'Jun', value: 0 },
    { month: 'Jul', value: 0 },
    { month: 'Aug', value: 0 },
    { month: 'Sep', value: 0 },
    { month: 'Oct', value: 0 },
    { month: 'Nov', value: 0 },
    { month: 'Dec', value: 0 }
  ];

  yAxisTicks: number[] = [];
  maxValue: number = 2000;
  isLoading = true;

  constructor(
    private userService: UserService,
    private lessonService: LessonService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
    this.generateYAxisTicks();
  }

  private generateYAxisTicks(): void {
    // Adjust these values based on your actual data range
    const step = 550;
    this.yAxisTicks = [0, 550, 1100, 1650, 2000];
  }

  calculateBarHeight(value: number): number {
    return (value / this.maxValue) * 100;
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    // Fetch all users and filter instructors
    this.userService.getAllUsersWithRoles().subscribe({
      next: (users) => {
        this.updateCardValue('Utilisateurs', users.length);
        this.updateUserGrowthData(users); // Mettez à jour les données de croissance
        
        const instructors = users.filter((user: any) => user.roleName.toLowerCase() === 'instructor').length;
        this.updateCardValue('Formateurs', instructors);
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
      }
    });

    // Fetch all lessons
    this.lessonService.getAllLessons().subscribe({
      next: (lessons) => {
        this.updateCardValue('Leçons', lessons.length);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading lessons:', err);
        this.isLoading = false;
      }
    });
  }

  private updateUserGrowthData(users: any[]): void {
    // Ici, vous devriez implémenter la logique pour obtenir les données mensuelles
    // Ceci est un exemple - vous devrez adapter en fonction de votre structure de données
    
    // Exemple simplifié (à remplacer par votre logique réelle)
    const currentMonth = new Date().getMonth();
    this.userGrowth[currentMonth].value = users.length;
    
    // Mettre à jour maxValue si nécessaire
    const currentMax = Math.max(...this.userGrowth.map(m => m.value));
    if (currentMax > this.maxValue) {
      this.maxValue = Math.ceil(currentMax / 500) * 500; // Arrondir au prochain multiple de 500
      this.generateYAxisTicks();
    }
  }

  private updateCardValue(label: string, value: number): void {
    const card = this.statCards.find(c => c.label === label);
    if (card) {
      card.value = value.toString();
    }
  }
}