type Props = {
    title: string;
    subtitle: string;
    logo: string;
    hasBorder: boolean;
};

export function Logo(props: Props) {
    return (
        <div className={`flex items-center ${props.hasBorder ? 'border-b w-full py-6' : 'py-2'} justify-start px-4 gap-4 border-border`}>
            {/* <img src={props.logo} alt="Logo" className="w-8 h-8 rounded-xl" /> */}
            <div className="w-8 h-8 rounded-xl bg-text-focus" />
            <div>
                <h1 className="text-base">{props.title}</h1>
                <p className="text-sm text-text-muted">{props.subtitle}</p>
            </div>
        </div>
    );
}
