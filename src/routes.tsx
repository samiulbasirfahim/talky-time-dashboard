import { createBrowserRouter } from "react-router";
import { AppLayout } from "./layout/app-layout/AppLayout";

import {
    NotFound,
    ReportHistory,
    BonusPerformance,
    ScoreCutoffs,
    Settings,
    Operator,
    Dashboard,
    Supervisors,
    Discipline,
    CsvUpload,
    Profile,
    Transactions,
    Payouts,
} from "./pages";
import { Login } from "./pages/login/login";
import { ResetPasswordEmail } from "./pages/reset-password/email";
import { ResetPasswordOtp } from "./pages/reset-password/otp";
import { SetNewPassword } from "./pages/reset-password/set-new-password";
import { ProtectedRoute, PublicRoute } from "./layout/protected.layout";
import { ManagementPage } from "./pages/management/page";

export const routes = createBrowserRouter([
    {
        path: "/login",
        element: (
            <PublicRoute redirectPath="/">
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: "/reset-password/email",
        element: (
            <PublicRoute redirectPath="/">
                <ResetPasswordEmail />
            </PublicRoute>
        ),
    },
    {
        path: "/reset-password/otp",
        element: (
            <PublicRoute redirectPath="/">
                <ResetPasswordOtp />
            </PublicRoute>
        ),
    },
    {
        path: "/reset-password/set-new-password",
        element: (
            <PublicRoute redirectPath="/">
                <SetNewPassword />
            </PublicRoute>
        ),
    },
    {
        path: "/",
        element: (
            <ProtectedRoute redirectPath="/login">
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, Component: Dashboard },
            {
                path: "supervisor",
                Component: Supervisors,
            },
            {
                path: "operators",
                Component: Operator,
            },

            {
                path: "profile",
                Component: Profile,
            },

            {
                path: "csv-upload",
                Component: CsvUpload,
            },
            {
                path: "score-cutoffs",
                Component: ScoreCutoffs,
            },
            {
                path: "bonus-performance",
                Component: BonusPerformance,
            },
            {
                path: "report-history",
                Component: ReportHistory,
            },
            {
                path: "discipline",
                Component: Discipline,
            },
            {
                path: "settings",
                Component: Settings,
            },
            {
                path: "transactions",
                Component: Transactions,
            },
            {
                path: "payouts",
                Component: Payouts,
            },

            {
                path: "management",
                Component: ManagementPage,
            }

        ],
    },

            {
                path: "*",
                Component: NotFound,
            },
]);
