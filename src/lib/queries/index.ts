import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    // defaultOptions: {
    //     queries: {
    //     }
    // }
})


export { queryClient };
export * from './auth.query';
export * from './group.query';
export * from './supervisor.query';
export * from './operator.query';
export * from './upload.query';
export * from './profile.query';
export * from './debts.query';
export * from './cash-advance.query';
export * from './discount.query';
export * from './score-cutoff.query';
export * from './dashboard.query';
export * from './discipline.query';
export * from './settings.query';