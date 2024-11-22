<?php

namespace App\Console\Commands;

use App\Models\Permission;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class GeneratePermissionType extends Command
{
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
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->generateBackendType();
    }

    private function generateBackendType()
    {
        $permission_names = Permission::pluck('name');

        $str = <<<EOF
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
        }, $permission_names->toArray());
        $result = str_replace('@names', join("\n    ", $enum_cases), $str);
        File::put(app_path('Enums/PermissionType.php'), $result);
    }
}
