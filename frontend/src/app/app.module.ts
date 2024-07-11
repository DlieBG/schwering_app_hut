import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthenticationInterceptor } from "./interceptors/authentication/authentication.interceptor";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { HomeComponent } from "./components/home/home.component";
import { SwitchComponent } from "./components/switch/switch.component";
import { WidgetComponent } from "./components/widget/widget.component";
import { GroupComponent } from "./components/group/group.component";
import { StatusComponent } from "./components/status/status.component";
import { StatusHeatingComponent } from "./components/status-heating/status-heating.component";
import { InputComponent } from "./components/input/input.component";
import { TemperatureComponent } from "./components/temperature/temperature.component";
import { HeatingComponent } from "./components/heating/heating.component";
import { HumidityComponent } from "./components/humidity/humidity.component";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SwitchComponent,
        WidgetComponent,
        GroupComponent,
        StatusComponent,
        StatusHeatingComponent,
        InputComponent,
        TemperatureComponent,
        HeatingComponent,
        HumidityComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatInputModule,
        MatCheckboxModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationInterceptor,
            multi: true,
        },
        provideAnimationsAsync(),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
