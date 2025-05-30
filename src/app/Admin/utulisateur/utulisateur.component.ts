import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/Service/user.service';
import { finalize } from 'rxjs/operators';
import { LevelService } from 'src/app/Service/level.service';
import { classService } from 'src/app/Service/class.service';

@Component({
  selector: 'app-utulisateur',
  templateUrl: './utulisateur.component.html',
  styleUrls: ['./utulisateur.component.css']
})
export class UtulisateurComponent implements OnInit {
  // Variables de contrôle d'interface
  searchTerm = '';
  showModal = false;
  showDeleteModal = false;
  isEditing = false;
  showAddDialog = false;
  isLoading = false;
  errorMessage: string | null = null;

  // Données utilisateurs
  users: any[] = [];
  filteredUsers: any[] = [];
  parentsList: any[] = [];
  levels: any[] = [];
  classes: any[] = [];

  // Données pour l'édition/création
  userToEdit: any = null;
  userToDelete: any = null;
  selectedUser: any = null;
  selectedRole: string = 'Student';
  currentFilter = 'all';

  // Formulaires
  showStudentForm = false;
  showParentForm = false;
  showInstructorForm = false;

  newStudent = {
    firstName: '',
    lastName: '',
    dateOfBirth: { year: new Date().getFullYear() - 20, month: 1, day: 1 },
    parentId: null,
    classeId: null,
    levelId: null
  };

  newParent = {
    firstName: '',
    lastName: '',
    email: '',
    password: 'defaultPassword',
    telephone: '',
    address: '',
    cin: ''
  };

  newInstructor = {
    firstName: '',
    lastName: '',
    email: '',
    password: 'defaultPassword',
    telephone: '',
    address: '',
    cin: '',
    specialite: ''
  };

  constructor(
    private userService: UserService, 
    private levelService: LevelService, 
    private classService: classService
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Chargement parallèle des données
    Promise.all([
      this.loadAllUsers(),
      this.loadParents(),
      this.loadLevels(),
      this.loadClasses()
    ]).finally(() => {
      this.isLoading = false;
      this.showFormsBasedOnRole();
    });
  }

  loadAllUsers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getAllUsersWithRoles()
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (users) => {
            if (users && Array.isArray(users)) {
              this.users = users.map(user => this.mapToLocalUser(user));
              this.applyFilters();
              resolve();
            } else {
              this.errorMessage = 'Aucun utilisateur trouvé';
              this.users = [];
              this.filteredUsers = [];
              reject('No users found');
            }
          },
          error: (err) => {
            console.error('Erreur de chargement:', err);
            this.errorMessage = err.message || 'Échec du chargement';
            this.users = [];
            this.filteredUsers = [];
            reject(err);
          }
        });
    });
  }

  loadParents(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getAllParents().subscribe({
        next: (parents) => {
          this.parentsList = parents || [];
          resolve();
        },
        error: (err) => {
          console.error('Erreur de chargement des parents:', err);
          reject(err);
        }
      });
    });
  }

  loadLevels(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.levelService.getAllLevels().subscribe({
        next: (levels) => {
          this.levels = levels;
          resolve();
        },
        error: (err) => {
          console.error('Error loading levels:', err);
          this.errorMessage = 'Failed to load levels. Please try again later.';
          reject(err);
        }
      });
    });
  }

  loadClasses(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.classService.getAllClasses().subscribe({
       next: (classes: any) => {
  this.classes = classes;
  resolve();
},
error: (err: any) => {
  console.error('Error loading classes:', err);
  this.errorMessage = 'Failed to load classes. Please try again later.';
  reject(err);
}
      });
    });
  }

  private applyFilters() {
    let filtered = [...this.users];

    // Filtre par rôle
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(user =>
        user.role.toLowerCase() === this.currentFilter.toLowerCase()
      );
    }

    // Filtre par recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        (user.firstName?.toLowerCase().includes(term) ||
          user.lastName?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.telephone?.toLowerCase().includes(term) ||
          user.role?.toLowerCase().includes(term))
      );
    }

    this.filteredUsers = filtered;
  }

  filterUsers() {
    this.applyFilters();
  }

  filterByStatus(event: any) {
    this.currentFilter = event.target.value;
    this.applyFilters();
  }
setFilter(filter: string) {
  this.currentFilter = filter;
  this.applyFilters();
}
  private mapToLocalUser(apiUser: any): any {
    if (!apiUser) return null;

    let dateOfBirth = null;
    if (apiUser.dateOfBirth) {
      const dob = new Date(apiUser.dateOfBirth);
      dateOfBirth = {
        year: dob.getFullYear(),
        month: dob.getMonth() + 1,
        day: dob.getDate()
      };
    }

    return {
      id: apiUser.id || apiUser.userId || 0,
      firstName: apiUser.firstName || '',
      lastName: apiUser.lastName || '',
      email: apiUser.email || '',
      telephone: apiUser.telephone || '',
      role: apiUser.roleName || apiUser.role || 'Unknown',
      address: apiUser.address || apiUser.adresse || '',
      cin: apiUser.cin || '',
      specialite: apiUser.specialite || '',
      dateOfBirth: dateOfBirth,
      parentId: apiUser.parentId || null
    };
  }

  openEditModal(user: any) {
    this.isEditing = true;
    this.userToEdit = JSON.parse(JSON.stringify(user));
    this.showModal = true;
  }

  saveUser() {
    if (!this.userToEdit) return;

    this.isLoading = true;
    this.errorMessage = null;

    let updateData: any = {
      firstName: this.userToEdit.firstName,
      lastName: this.userToEdit.lastName,
      email: this.userToEdit.email,
      telephone: this.userToEdit.telephone
    };

    // Ajout des champs spécifiques selon le rôle
    if (this.userToEdit.role === 'Parent' || this.userToEdit.role === 'Instructor') {
      updateData.address = this.userToEdit.address;
      updateData.cin = this.userToEdit.cin;
    }

    if (this.userToEdit.role === 'Instructor') {
      updateData.specialite = this.userToEdit.specialite;
    }

    if (this.userToEdit.role === 'Student') {
      updateData.parentId = this.userToEdit.parentId;
      if (this.userToEdit.dateOfBirth) {
        updateData.dateOfBirth = new Date(
          this.userToEdit.dateOfBirth.year,
          this.userToEdit.dateOfBirth.month - 1,
          this.userToEdit.dateOfBirth.day
        ).toISOString();
      }
    }
    
    let updateObservable;

    switch (this.userToEdit.role) {
      case 'Student':
        updateObservable = this.userService.updateStudent(this.userToEdit.id, updateData);
        break;
      case 'Parent':
        updateObservable = this.userService.updateParent(this.userToEdit.id, updateData);
        break;
      case 'Instructor':
        updateObservable = this.userService.updateInstructor(this.userToEdit.id, updateData);
        break;
      default:
        console.error('Type utilisateur inconnu');
        this.isLoading = false;
        return;
    }

    updateObservable.subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === this.userToEdit.id);
        if (index !== -1) {
          this.users[index] = this.mapToLocalUser(updatedUser);
          this.applyFilters();
        }
        this.showModal = false;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur de mise à jour:', err);
        this.errorMessage = err.error?.message || err.message || 'Échec de la mise à jour';
        this.isLoading = false;
      }
    });
  }

  confirmDelete(user: any) {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  deleteUser() {
    if (!this.userToDelete) return;

    this.isLoading = true;
    this.errorMessage = null;

    let deleteObservable;

    switch (this.userToDelete.role) {
      case 'Student':
        deleteObservable = this.userService.deleteStudent(this.userToDelete.id);
        break;
      case 'Parent':
        deleteObservable = this.userService.deleteParent(this.userToDelete.id);
        break;
      case 'Instructor':
        deleteObservable = this.userService.deleteInstructor(this.userToDelete.id);
        break;
      default:
        console.error('Type utilisateur inconnu');
        this.isLoading = false;
        return;
    }

    deleteObservable.subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== this.userToDelete.id);
        this.applyFilters();
        this.showDeleteModal = false;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur de suppression:', err);
        this.errorMessage = err.error?.message || err.message || 'Échec de la suppression';
        this.isLoading = false;
        this.showDeleteModal = false;
      }
    });
  }

  openAddDialog() {
    this.showAddDialog = true;
    this.selectedRole = 'Student';
    this.showFormsBasedOnRole();
    this.resetForms();
  }

  closeAddDialog() {
    this.showAddDialog = false;
    this.resetForms();
  }

  resetForms() {
    this.newStudent = {
      firstName: '',
      lastName: '',
      dateOfBirth: { year: new Date().getFullYear() - 20, month: 1, day: 1 },
      parentId: null,
      classeId: null,
      levelId: null
    };

    this.newParent = {
      firstName: '',
      lastName: '',
      email: '',
      password: 'defaultPassword',
      telephone: '',
      address: '',
      cin: ''
    };

    this.newInstructor = {
      firstName: '',
      lastName: '',
      email: '',
      password: 'defaultPassword',
      telephone: '',
      address: '',
      cin: '',
      specialite: ''
    };
  }

  onRoleChange() {
    this.showFormsBasedOnRole();
  }

  showFormsBasedOnRole() {
    this.showStudentForm = this.selectedRole === 'Student';
    this.showParentForm = this.selectedRole === 'Parent';
    this.showInstructorForm = this.selectedRole === 'Instructor';
  }

  formatDateToDDMMYYYY(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  addNewUser() {
    this.isLoading = true;
    this.errorMessage = null;

    let createObservable;
    let userData;

    switch (this.selectedRole) {
      case 'Student':
        userData = {
          firstName: this.newStudent.firstName,
          lastName: this.newStudent.lastName,
          dateOfBirth: this.formatDateToDDMMYYYY(new Date(
            this.newStudent.dateOfBirth.year,
            this.newStudent.dateOfBirth.month - 1,
            this.newStudent.dateOfBirth.day
          )),
          parentId: Number(this.newStudent.parentId),
          levelId: Number(this.newStudent.levelId),
          classeId: Number(this.newStudent.classeId)
        };
        createObservable = this.userService.createStudent(userData);
        break;

      case 'Parent':
        userData = {
          firstName: this.newParent.firstName,
          lastName: this.newParent.lastName,
          email: this.newParent.email,
          password: this.newParent.password,
          telephone: this.newParent.telephone,
          address: this.newParent.address,
          cin: this.newParent.cin
        };
        createObservable = this.userService.createParent(userData);
        break;

      case 'Instructor':
        userData = {
          firstName: this.newInstructor.firstName,
          lastName: this.newInstructor.lastName,
          email: this.newInstructor.email,
          password: this.newInstructor.password,
          telephone: this.newInstructor.telephone,
          address: this.newInstructor.address,
          cin: this.newInstructor.cin,
          specialite: this.newInstructor.specialite
        };
        createObservable = this.userService.createInstructor(userData);
        break;

      default:
        this.errorMessage = 'Rôle utilisateur invalide';
        this.isLoading = false;
        return;
    }

    createObservable.subscribe({
      next: (createdUser) => {
        this.users.push(this.mapToLocalUser(createdUser));
        this.applyFilters();
        this.closeAddDialog();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur de création:', err);
        this.errorMessage = err.error?.message || err.message || 'Échec de la création';
        this.isLoading = false;
      }
    });
  }

  showDetails(user: any) {
    this.selectedUser = JSON.parse(JSON.stringify(user));
  }

  retryLoadUsers() {
    this.loadAllUsers();
  }

  getParentName(parentId: number): string {
    if (!parentId || !this.parentsList) return 'Non spécifié';
    const parent = this.parentsList.find(p => p.id === parentId);
    return parent ? `${parent.user?.firstName} ${parent.user?.lastName}` : 'Non spécifié';
  }

  getDays(): number[] {
    return Array.from({ length: 31 }, (_, i) => i + 1);
  }

  getMonths(): string[] {
    return [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
  }

  getYears(): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - i);
  }

  formatDate(dateObj: any): string {
    if (!dateObj) return 'Non spécifié';
    return `${dateObj.day}/${dateObj.month}/${dateObj.year}`;
  }
}