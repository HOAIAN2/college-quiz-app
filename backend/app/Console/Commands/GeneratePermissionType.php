<?php

namespace App\Console\Commands;

use App\Models\Permission;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class GeneratePermissionType extends Command
{

    private $permission_names = [];
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-permission-type';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create Enum Permission for backend and type for frontend';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->permission_names = Permission::pluck('name')->toArray();
        $this->generateBackendType();
        $this->generateFrontendType();
    }

    private function generateBackendType()
    {
        $content = <<<EOF
        <?php

        namespace App\Enums;

        use App\Traits\EnumResolver;

        enum PermissionType: string
        {
            use EnumResolver;

            @names
        }

        EOF;
        $enum_cases = array_map(function ($item) {
            return "case " . strtoupper($item) . ' = ' . '\'' . $item . '\'' . ';';
        }, $this->permission_names);
        $result = str_replace('@names', join("\n    ", $enum_cases), $content);
        File::put(app_path('Enums/PermissionType.php'), $result);
    }

    private function generateFrontendType()
    {
        $content = <<<EOF
        export type PermissionName =
            @names;

        EOF;
        $type_cases = array_map(function ($item) {
            return '\'' . $item . '\'';
        }, $this->permission_names);
        $result = str_replace('@names', join(" |\n    ", $type_cases), $content);
        File::put(base_path('../frontend/src/models/app-permission-name.ts'), $result);
    }
}
