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